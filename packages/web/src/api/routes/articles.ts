import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, desc } from "drizzle-orm";

export const articles = new Hono()
  .get("/", async (c) => {
    const result = await db.select().from(schema.articles).where(eq(schema.articles.published, true)).orderBy(desc(schema.articles.createdAt));
    return c.json({ articles: result }, 200);
  })
  .get("/:slug", async (c) => {
    const { slug } = c.req.param();
    const [article] = await db.select().from(schema.articles).where(eq(schema.articles.slug, slug));
    if (!article) return c.json({ message: "Not found" }, 404);
    return c.json({ article }, 200);
  });
