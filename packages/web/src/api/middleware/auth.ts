import { createMiddleware } from "hono/factory";
import { auth } from "../auth";

type AuthEnv = {
  Variables: {
    user: { id: string; name: string; email: string } | null;
    session: { id: string } | null;
  };
};

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  c.set("user", (session?.user ?? null) as any);
  c.set("session", (session?.session ?? null) as any);
  return next();
});

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  if (!c.get("user")) return c.json({ message: "Unauthorized" }, 401);
  return next();
});
