import { Hono } from "hono";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAuth, authMiddleware } from "../middleware/auth";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET!;
const PUBLIC_BASE = process.env.S3_ENDPOINT!.replace("https://", `https://${process.env.S3_BUCKET}.`);

export const upload = new Hono()
  .use("*", authMiddleware)

  // Returns a presigned PUT URL + the final public URL
  .post("/presign", requireAuth, async (c) => {
    const { filename, contentType } = await c.req.json<{ filename: string; contentType: string }>();
    const key = `uploads/${crypto.randomUUID()}-${filename}`;
    const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
    const presignedUrl = await getSignedUrl(s3, cmd, { expiresIn: 300 });
    const publicUrl = `${PUBLIC_BASE}/${key}`;
    return c.json({ presignedUrl, publicUrl }, 200);
  })

  // Upload via base64 (usado pela app mobile)
  .post("/image", requireAuth, async (c) => {
    try {
      const { base64, mimeType } = await c.req.json<{ base64: string; mimeType?: string }>();
      if (!base64 || base64.length < 50) {
        return c.json({ error: "Imagem inválida ou vazia." }, 400);
      }
      const mime = mimeType ?? "image/jpeg";
      const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
      const key = `uploads/${crypto.randomUUID()}.${ext}`;

      const buffer = Buffer.from(base64, "base64");

      // Limite 10MB
      if (buffer.length > 10 * 1024 * 1024) {
        return c.json({ error: "Imagem demasiado grande (máx. 10MB)." }, 413);
      }

      await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mime,
        ACL: "public-read" as any,
      }));

      const url = `${PUBLIC_BASE}/${key}`;
      return c.json({ url }, 200);
    } catch (e: any) {
      console.error("[upload/image]", e?.message);
      return c.json({ error: "Erro ao fazer upload." }, 500);
    }
  })

  // Upload de documento/ficheiro via base64
  .post("/document", requireAuth, async (c) => {
    try {
      const { base64, mimeType, filename } = await c.req.json<{ base64: string; mimeType?: string; filename?: string }>();
      if (!base64 || base64.length < 10) {
        return c.json({ error: "Ficheiro inválido ou vazio." }, 400);
      }
      const mime = mimeType ?? "application/octet-stream";
      const safeName = (filename ?? "document").replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `uploads/docs/${crypto.randomUUID()}-${safeName}`;

      const buffer = Buffer.from(base64, "base64");

      if (buffer.length > 20 * 1024 * 1024) {
        return c.json({ error: "Ficheiro demasiado grande (máx. 20MB)." }, 413);
      }

      await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mime,
        ACL: "public-read" as any,
      }));

      const url = `${PUBLIC_BASE}/${key}`;
      return c.json({ url }, 200);
    } catch (e: any) {
      console.error("[upload/document]", e?.message);
      return c.json({ error: "Erro ao fazer upload do documento." }, 500);
    }
  });
