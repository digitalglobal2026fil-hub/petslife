import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { authMiddleware } from "./middleware/auth";
import { pets } from "./routes/pets";
import { vaccines } from "./routes/vaccines";
import { appointments } from "./routes/appointments";
import { health } from "./routes/health";
import { photos } from "./routes/photos";
import { documents } from "./routes/documents";
import { posts } from "./routes/posts";
import { marketplace } from "./routes/marketplace";
import { subscriptions } from "./routes/subscriptions";
import { articles } from "./routes/articles";
import { consultations } from "./routes/consultations";
import { upload } from "./routes/upload";
import { dewormings } from "./routes/dewormings";
import { weightLogs } from "./routes/weight-logs";

const app = new Hono()
  .use(cors({
    origin: (origin) => origin ?? "*",
    credentials: true,
    exposeHeaders: ["set-auth-token"],
  }))
  .on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .basePath("api")
  .use("*", authMiddleware)
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .route("/pets", pets)
  .route("/vaccines", vaccines)
  .route("/appointments", appointments)
  .route("/health-logs", health)
  .route("/photos", photos)
  .route("/documents", documents)
  .route("/posts", posts)
  .route("/marketplace", marketplace)
  .route("/subscriptions", subscriptions)
  .route("/articles", articles)
  .route("/consultations", consultations)
  .route("/upload", upload)
  .route("/dewormings", dewormings)
  .route("/weight-logs", weightLogs);

export type AppType = typeof app;
export default app;
