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
  });
