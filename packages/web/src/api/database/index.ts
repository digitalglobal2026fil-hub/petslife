import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL ?? "file:local.db";

const client = createClient({
  url: dbUrl,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Raw libsql client for routes that need raw SQL (db.execute is not available on drizzle)
export const sqlClient = client;
