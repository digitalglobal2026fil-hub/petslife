// Remove o script do badge "Made with Runable" do build.
// O Render serve dist/ directamente, por isso corremos isto depois do build.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const file = new URL("./dist/index.html", import.meta.url).pathname;
if (!existsSync(file)) {
  console.log("[strip-badge] dist/index.html nao existe, nada a fazer");
  process.exit(0);
}
let html = readFileSync(file, "utf8");
const before = html.length;
html = html.replace(/<script[^>]*runable\.js[^>]*>\s*<\/script>/gi, "");
html = html.replace(/<script[^>]*r\.lilstts\.com[^>]*>\s*<\/script>/gi, "");
writeFileSync(file, html);
console.log(`[strip-badge] ${before - html.length} chars removidos de dist/index.html`);
