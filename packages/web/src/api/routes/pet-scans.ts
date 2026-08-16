import { Hono } from "hono";
import { db, sqlClient } from "../database";
import * as schema from "../database/schema";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import * as authSchema from "../database/auth-schema";
import { requireAuth } from "../middleware/auth";
import { sendMail, sendSms } from "../notify";

/**
 * Colunas acrescentadas depois da tabela já existir em produção. O ALTER TABLE
 * dá erro se a coluna já lá estiver — por isso ignoramos o erro de propósito.
 */
let columnsReady: Promise<void> | null = null;
function ensureColumns() {
  if (!columnsReady) {
    columnsReady = (async () => {
      for (const col of ["dismissed_at", "found_at"]) {
        try {
          await sqlClient.execute({
            sql: `ALTER TABLE pet_scans ADD COLUMN ${col} INTEGER`,
            args: [],
          });
        } catch {
          /* a coluna já existe */
        }
      }
    })();
  }
  return columnsReady;
}

export const petScans = new Hono()

  // PÚBLICO — quem encontra o animal digitaliza o QR e envia a localização.
  // Recebe o qrCode (não o petId) para não expor ids internos.
  .post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}) as any);
    const qrCode = String(body.qrCode || "").trim();
    if (!qrCode) return c.json({ error: "qrCode obrigatório" }, 400);

    const [pet] = await db.select().from(schema.pets).where(eq(schema.pets.qrCode, qrCode));
    if (!pet) return c.json({ error: "Animal não encontrado" }, 404);

    const [row] = await db
      .insert(schema.petScans)
      .values({
        petId: pet.id,
        lat: body.lat != null ? Number(body.lat) : null,
        lng: body.lng != null ? Number(body.lng) : null,
        accuracy: body.accuracy != null ? Number(body.accuracy) : null,
        address: body.address ?? null,
        finderName: body.finderName ?? null,
        finderPhone: body.finderPhone ?? null,
        message: body.message ?? null,
        userAgent: c.req.header("user-agent") ?? null,
      })
      .returning();

    void notifyOwner(pet, row, false);

    return c.json({ ok: true, scan: { id: row.id } }, 201);
  })

  // PÚBLICO — quem encontra o animal já abriu o QR (registo automático acima) e
  // agora partilha localização/contacto: actualiza o mesmo registo em vez de
  // criar outro, e avisa o dono de novo já com o mapa.
  .put("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}) as any);
    const qrCode = String(body.qrCode || "").trim();
    if (!qrCode) return c.json({ error: "qrCode obrigatório" }, 400);

    const [scan] = await db.select().from(schema.petScans).where(eq(schema.petScans.id, id));
    if (!scan) return c.json({ error: "Registo não encontrado" }, 404);

    const [pet] = await db.select().from(schema.pets).where(eq(schema.pets.qrCode, qrCode));
    if (!pet || pet.id !== scan.petId) return c.json({ error: "Sem permissão" }, 403);

    const [row] = await db
      .update(schema.petScans)
      .set({
        lat: body.lat != null ? Number(body.lat) : scan.lat,
        lng: body.lng != null ? Number(body.lng) : scan.lng,
        accuracy: body.accuracy != null ? Number(body.accuracy) : scan.accuracy,
        address: body.address ?? scan.address,
        finderName: body.finderName ?? scan.finderName,
        finderPhone: body.finderPhone ?? scan.finderPhone,
        message: body.message ?? scan.message,
      })
      .where(eq(schema.petScans.id, id))
      .returning();

    void notifyOwner(pet, row, true);

    return c.json({ ok: true, scan: { id: row.id } }, 200);
  })

  // DONO — todas as digitalizações dos seus animais (para o ecrã Notificações)
  .get("/mine", requireAuth, async (c) => {
    await ensureColumns();
    const user = c.get("user")!;
    const myPets = await db
      .select({ id: schema.pets.id, name: schema.pets.name, species: schema.pets.species })
      .from(schema.pets)
      .where(eq(schema.pets.userId, user.id));
    if (myPets.length === 0) return c.json({ scans: [] });
    // Só os avisos que o dono ainda não apagou nem marcou como resolvidos.
    const rows = await db
      .select()
      .from(schema.petScans)
      .where(
        and(
          inArray(schema.petScans.petId, myPets.map((p) => p.id)),
          isNull(schema.petScans.dismissedAt),
          isNull(schema.petScans.foundAt),
        ),
      )
      .orderBy(desc(schema.petScans.createdAt))
      .limit(50);
    const byId = new Map(myPets.map((p) => [p.id, p]));
    return c.json({
      scans: rows.map((r) => ({
        ...r,
        petName: byId.get(r.petId)?.name ?? "",
        petSpecies: byId.get(r.petId)?.species ?? "",
      })),
    });
  })

  // DONO — ver onde o animal foi digitalizado
  .get("/pet/:petId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const petId = c.req.param("petId");
    const [pet] = await db.select().from(schema.pets).where(eq(schema.pets.id, petId));
    if (!pet || pet.userId !== user.id) return c.json({ error: "Sem permissão" }, 403);

    const rows = await db
      .select()
      .from(schema.petScans)
      .where(eq(schema.petScans.petId, petId))
      .orderBy(desc(schema.petScans.createdAt))
      .limit(50);
    return c.json({ scans: rows });
  })

  // DONO — apagar um aviso. Fica guardado no servidor, por isso não volta a
  // aparecer quando a app é fechada e reaberta.
  .post("/:id/dismiss", requireAuth, async (c) => {
    await ensureColumns();
    const user = c.get("user")!;
    const id = c.req.param("id");

    const [scan] = await db.select().from(schema.petScans).where(eq(schema.petScans.id, id));
    if (!scan) return c.json({ error: "Aviso não encontrado" }, 404);

    const [pet] = await db.select().from(schema.pets).where(eq(schema.pets.id, scan.petId));
    if (!pet || pet.userId !== user.id) return c.json({ error: "Sem permissão" }, 403);

    await db
      .update(schema.petScans)
      .set({ dismissedAt: new Date() })
      .where(eq(schema.petScans.id, id));

    return c.json({ ok: true }, 200);
  })

  // DONO — "Já encontrei o meu animal": fecha todos os avisos deste animal de
  // uma vez, para os avisos pararem.
  .post("/pet/:petId/found", requireAuth, async (c) => {
    await ensureColumns();
    const user = c.get("user")!;
    const petId = c.req.param("petId");

    const [pet] = await db.select().from(schema.pets).where(eq(schema.pets.id, petId));
    if (!pet || pet.userId !== user.id) return c.json({ error: "Sem permissão" }, 403);

    await db
      .update(schema.petScans)
      .set({ foundAt: new Date() })
      .where(and(eq(schema.petScans.petId, petId), isNull(schema.petScans.foundAt)));

    return c.json({ ok: true, petName: pet.name }, 200);
  });

/**
 * Avisa o dono por email e SMS. Chamado duas vezes no máximo:
 *  - withLocation=false → alguém abriu o QR (aviso imediato)
 *  - withLocation=true  → a pessoa partilhou localização/contacto
 */
async function notifyOwner(pet: any, row: any, withLocation: boolean) {
  try {
    const [owner] = await db
      .select({ name: authSchema.user.name, email: authSchema.user.email })
      .from(authSchema.user)
      .where(eq(authSchema.user.id, pet.userId));
    const [profile] = await db
      .select({ phone: schema.userProfiles.phone })
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, pet.userId));

    const hasCoords = row.lat != null && row.lng != null;
    const mapsUrl = hasCoords ? `https://www.google.com/maps?q=${row.lat},${row.lng}` : null;
    const when = new Date().toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" });
    const subject = withLocation
      ? `\ud83d\udccd Localização recebida — ${pet.name}`
      : `\ud83d\udea8 O QR code do ${pet.name} foi digitalizado!`;
    const lead = withLocation
      ? `Quem encontrou o <strong>${pet.name}</strong> acabou de partilhar a localização!`
      : `Alguém acabou de digitalizar o QR code do <strong>${pet.name}</strong>!`;

    if (owner?.email) {
      await sendMail(
        owner.email,
        subject,
        `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:28px">
          <h2 style="color:#FF6B35;margin:0 0 8px">\ud83d\udc3e PetsLife</h2>
          <p style="font-size:17px;font-weight:700;color:#1A1A2E">${lead}</p>
          <p style="color:#374151">Data e hora: <strong>${when}</strong></p>
          ${row.finderName ? `<p style="color:#374151">Quem encontrou: <strong>${row.finderName}</strong></p>` : ""}
          ${row.finderPhone ? `<p style="color:#374151">Telefone de contacto: <strong>${row.finderPhone}</strong></p>` : ""}
          ${row.message ? `<p style="color:#374151">Mensagem: &ldquo;${row.message}&rdquo;</p>` : ""}
          ${row.address ? `<p style="color:#374151">Local aproximado: ${row.address}</p>` : ""}
          ${mapsUrl
            ? `<p style="text-align:center;margin:26px 0">
            <a href="${mapsUrl}" style="background:#FF6B35;color:#fff;padding:14px 26px;border-radius:12px;text-decoration:none;font-weight:700">Ver no mapa</a>
          </p>`
            : `<p style="color:#6B7280;font-size:13px">Ainda não foi partilhada a localização. Se a pessoa a partilhar, receberá outro email com o mapa.</p>`}
          <p style="color:#6B7280;font-size:13px">Abre a app PetsLife &gt; Notificações para ver todas as digitalizações.</p>
        </div>
      `,
      );
    }

    if (profile?.phone) {
      const sms =
        `PetsLife: o QR do ${pet.name} foi digitalizado (${when}).` +
        (row.finderPhone ? ` Contacto: ${row.finderPhone}.` : "") +
        (mapsUrl ? ` Local: ${mapsUrl}` : "");
      await sendSms(profile.phone, sms);
    }
  } catch (e: any) {
    console.error("[pet-scans] falha ao avisar o dono:", e?.message);
  }
}
