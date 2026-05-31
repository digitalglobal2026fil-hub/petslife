import { Hono } from "hono";
import { requireAuth, authMiddleware } from "../middleware/auth";

const S3_ENABLED = !!(process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID);

let s3: any = null;
let getSignedUrl: any = null;
let PutObjectCommand: any = null;
const BUCKET = process.env.S3_BUCKET ?? "";
const PUBLIC_BASE = S3_ENABLED
  ? process.env.S3_ENDPOINT!.replace("https://", `https://${process.env.S3_BUCKET}.`)
  : "";

if (S3_ENABLED) {
  const { S3Client } = require("@aws-sdk/client-s3");
  const presigner = require("@aws-sdk/s3-request-presigner");
  const s3sdk = require("@aws-sdk/client-s3");
  s3 = new S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
  getSignedUrl = presigner.getSignedUrl;
  PutObjectCommand = s3sdk.PutObjectCommand;
}

export const upload = new Hono()
  .use("*", authMiddleware)
  .post("/presign", requireAuth, async (c) => {
    if (!S3_ENABLED) {
      return c.json({ error: "File uploads not configured" }, 503);
    }
    const { filename, contentType } = await c.req.json();
    const key = `uploads/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return c.json({ url, publicUrl: `${PUBLIC_BASE}/${key}` });
  });
