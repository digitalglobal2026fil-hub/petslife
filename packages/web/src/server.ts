import app from "./api";
import { handleCallSocket } from "./call-signaling";

const port = Number(process.env.PORT ?? 3000);
const distDir = `${import.meta.dir}/../dist`;
const indexPath = `${distDir}/index.html`;

const server = Bun.serve({
  port,
  hostname: "0.0.0.0",
  websocket: handleCallSocket(),
  async fetch(request, server) {
    const url = new URL(request.url);

    // Sinalização das consultas online (WebRTC ponto a ponto)
    if (url.pathname === "/ws/call") {
      if (server.upgrade(request, { data: {} })) return undefined as any;
      return new Response("Expected a WebSocket upgrade", { status: 400 });
    }

    if (url.pathname.startsWith("/api")) {
      return app.fetch(request);
    }

    const filePath = getStaticFilePath(url.pathname);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file);
    }

    const index = Bun.file(indexPath);
    if (await index.exists()) {
      return new Response(index, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Build output not found. Run \`bun run build\` first.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  },
});

console.log(`Web server listening on http://localhost:${server.port}`);

function getStaticFilePath(pathname: string) {
  const cleanPath = decodeURIComponent(pathname)
    .replace(/^\/+/, "")
    .replaceAll("..", "");

  // O index.html referencia ./runable.js de forma relativa, pelo que em rotas
  // com sub-caminho (/call/xxx, /pet/xxx) o pedido ia para /call/runable.js,
  // caía no index.html e o browser atirava "Unexpected token '<'".
  if (cleanPath.endsWith("runable.js")) return `${distDir}/runable.js`;

  return cleanPath ? `${distDir}/${cleanPath}` : indexPath;
}
