import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";
import { isAdmin } from "../lib/admin";

export const posts = new Hono()
  .use("*", authMiddleware)
  .get("/", async (c) => {
    const result = await db.select().from(schema.posts).orderBy(desc(schema.posts.createdAt)).limit(50);
    return c.json({ posts: result }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const [post] = await db.insert(schema.posts).values({ ...body, userId: user.id }).returning();
    return c.json({ post }, 201);
  })
  .post("/:id/like", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const existing = await db.select().from(schema.postLikes).where(and(eq(schema.postLikes.postId, id), eq(schema.postLikes.userId, user.id)));
    if (existing.length > 0) {
      await db.delete(schema.postLikes).where(and(eq(schema.postLikes.postId, id), eq(schema.postLikes.userId, user.id)));
      await db.update(schema.posts).set({ likesCount: Math.max(0, (existing.length - 1)) }).where(eq(schema.posts.id, id));
      return c.json({ liked: false }, 200);
    }
    await db.insert(schema.postLikes).values({ postId: id, userId: user.id });
    const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, id));
    await db.update(schema.posts).set({ likesCount: (post?.likesCount ?? 0) + 1 }).where(eq(schema.posts.id, id));
    return c.json({ liked: true }, 200);
  })
  .get("/:id/comments", async (c) => {
    const { id } = c.req.param();
    const result = await db.select().from(schema.postComments).where(eq(schema.postComments.postId, id)).orderBy(desc(schema.postComments.createdAt));
    return c.json({ comments: result }, 200);
  })
  .post("/:id/comments", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json();
    const [comment] = await db.insert(schema.postComments).values({ postId: id, userId: user.id, content: body.content }).returning();
    const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, id));
    await db.update(schema.posts).set({ commentsCount: (post?.commentsCount ?? 0) + 1 }).where(eq(schema.posts.id, id));
    return c.json({ comment }, 201);
  })
  // Apagar comentário: o autor apaga o seu; a administradora apaga qualquer um.
  .delete("/:postId/comments/:commentId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { postId, commentId } = c.req.param();
    const [comment] = await db.select().from(schema.postComments).where(eq(schema.postComments.id, commentId));
    if (!comment) return c.json({ message: "Não encontrado" }, 404);
    if (comment.userId !== user.id && !isAdmin(user)) {
      return c.json({ message: "Sem permissão" }, 403);
    }
    await db.delete(schema.postComments).where(eq(schema.postComments.id, commentId));
    const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, postId));
    if (post) {
      await db.update(schema.posts)
        .set({ commentsCount: Math.max(0, (post.commentsCount ?? 1) - 1) })
        .where(eq(schema.posts.id, postId));
    }
    return c.json({ success: true }, 200);
  })
  // Apagar publicação: o autor apaga a sua; a administradora apaga qualquer uma.
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, id));
    if (!post) return c.json({ message: "Não encontrado" }, 404);
    if (post.userId !== user.id && !isAdmin(user)) {
      return c.json({ message: "Sem permissão" }, 403);
    }
    await db.delete(schema.postComments).where(eq(schema.postComments.postId, id));
    await db.delete(schema.postLikes).where(eq(schema.postLikes.postId, id));
    await db.delete(schema.posts).where(eq(schema.posts.id, id));
    return c.json({ success: true, byAdmin: post.userId !== user.id }, 200);
  });
