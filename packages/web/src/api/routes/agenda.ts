import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

/**
 * Agenda — junta num único pedido tudo o que a pessoa tem marcado:
 * consultas, vacinas (próxima dose), desparasitações (próxima dose) e
 * lembretes/medicação. A app trata de espalhar os lembretes repetidos
 * pelos dias do mês que está a mostrar.
 */
export const agenda = new Hono()
  .use("*", authMiddleware)
  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;

    const [meusPets, consultas, vacinas, desparasitacoes, lembretes] = await Promise.all([
      db.select().from(schema.pets).where(eq(schema.pets.userId, user.id)),
      db.select().from(schema.appointments).where(eq(schema.appointments.userId, user.id)),
      db.select().from(schema.vaccines).where(eq(schema.vaccines.userId, user.id)),
      db.select().from(schema.dewormings).where(eq(schema.dewormings.userId, user.id)),
      db.select().from(schema.reminders).where(eq(schema.reminders.userId, user.id)),
    ]);

    const nomes: Record<string, string> = {};
    for (const p of meusPets) nomes[p.id] = p.name;

    return c.json(
      {
        pets: meusPets.map((p) => ({ id: p.id, name: p.name, species: p.species, photoUrl: p.photoUrl })),
        appointments: consultas.map((a) => ({
          id: a.id,
          petId: a.petId,
          petName: nomes[a.petId] ?? "",
          title: a.title,
          type: a.type,
          date: a.date,
          time: a.time,
          clinic: a.clinic,
          veterinarian: a.veterinarian,
          status: a.status,
        })),
        vaccines: vacinas.map((v) => ({
          id: v.id,
          petId: v.petId,
          petName: nomes[v.petId] ?? "",
          name: v.name,
          date: v.date,
          nextDate: v.nextDate,
          clinic: v.clinic,
        })),
        dewormings: desparasitacoes.map((d) => ({
          id: d.id,
          petId: d.petId,
          petName: nomes[d.petId] ?? "",
          product: d.product,
          date: d.date,
          nextDate: d.nextDate,
          type: d.type,
        })),
        reminders: lembretes.map((r) => ({
          id: r.id,
          petId: r.petId,
          petName: r.petId ? (nomes[r.petId] ?? "") : "",
          title: r.title,
          kind: r.kind,
          dosage: r.dosage,
          notes: r.notes,
          startDate: r.startDate,
          endDate: r.endDate,
          times: r.times,
          frequency: r.frequency,
          intervalDays: r.intervalDays,
          active: r.active,
        })),
      },
      200,
    );
  });
