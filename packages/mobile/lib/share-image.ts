import { Alert, Platform, Share } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

/**
 * Partilhar e imprimir imagens da app (fotos dos animais, documentos,
 * caderneta de vacinas, QR code, cartaz de animal perdido).
 *
 * A impressão usa o menu normal do Android/iOS — a pessoa escolhe a
 * impressora ou "Guardar como PDF".
 */

function isRemote(uri: string) {
  return /^https?:\/\//i.test(uri);
}

function extOf(uri: string) {
  const m = uri.split("?")[0].match(/\.(jpe?g|png|webp|heic|pdf)$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

/** Descarrega a imagem para um ficheiro local, se for preciso. */
async function toLocalFile(uri: string, name = "petslife"): Promise<string> {
  if (!isRemote(uri)) return uri;
  const dir = (FileSystem as any).cacheDirectory ?? "";
  const target = `${dir}${name}-${Date.now()}.${extOf(uri)}`;
  const res = await FileSystem.downloadAsync(uri, target);
  return res.uri;
}

/** Converte a imagem em data URL base64 (necessário para imprimir). */
async function toDataUrl(uri: string): Promise<string> {
  if (uri.startsWith("data:")) return uri;
  const local = await toLocalFile(uri);
  const b64 = await FileSystem.readAsStringAsync(local, { encoding: "base64" as any });
  const ext = extOf(local);
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${b64}`;
}

/** Partilhar uma imagem por WhatsApp, email, redes sociais, etc. */
export async function shareImage(uri?: string | null, message?: string) {
  try {
    if (!uri) {
      Alert.alert("Sem imagem", "Não há imagem para partilhar.");
      return;
    }
    if (uri.startsWith("data:")) {
      // Guardar o base64 num ficheiro para poder ser partilhado
      const b64 = uri.split(",")[1] ?? "";
      const dir = (FileSystem as any).cacheDirectory ?? "";
      const path = `${dir}petslife-${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(path, b64, { encoding: "base64" as any });
      uri = path;
    }
    const local = await toLocalFile(uri);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(local, {
        dialogTitle: message ?? "Partilhar imagem",
        mimeType: extOf(local) === "png" ? "image/png" : "image/jpeg",
      });
      return;
    }
    await Share.share(Platform.OS === "ios" ? { url: local, message } : { message: message ?? local });
  } catch (e: any) {
    Alert.alert("Não foi possível partilhar", e?.message ?? "Tente novamente.");
  }
}

/** Imprimir uma imagem (ou guardar em PDF) usando o menu do sistema. */
export async function printImage(uri?: string | null, title?: string) {
  try {
    if (!uri) {
      Alert.alert("Sem imagem", "Não há imagem para imprimir.");
      return;
    }
    const dataUrl = await toDataUrl(uri);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <style>
        @page { margin: 24px; }
        body { margin: 0; font-family: -apple-system, Roboto, sans-serif; text-align: center; }
        h1 { font-size: 20px; color: #6B3A2A; margin: 0 0 12px; }
        img { max-width: 100%; max-height: 88vh; object-fit: contain; }
        .rodape { margin-top: 14px; font-size: 11px; color: #999; }
      </style></head>
      <body>
        ${title ? `<h1>${title}</h1>` : ""}
        <img src="${dataUrl}" />
        <div class="rodape">PetsLife</div>
      </body></html>`;
    await Print.printAsync({ html });
  } catch (e: any) {
    Alert.alert("Não foi possível imprimir", e?.message ?? "Tente novamente.");
  }
}

/** Imprimir várias imagens de uma vez (ex: caderneta de vacinas, documentos). */
export async function printImages(uris: (string | null | undefined)[], title?: string) {
  try {
    const valid = uris.filter(Boolean) as string[];
    if (!valid.length) {
      Alert.alert("Sem imagens", "Não há imagens para imprimir.");
      return;
    }
    const dataUrls: string[] = [];
    for (const u of valid) {
      try {
        dataUrls.push(await toDataUrl(u));
      } catch {}
    }
    if (!dataUrls.length) {
      Alert.alert("Sem imagens", "Não foi possível preparar as imagens.");
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <style>
        @page { margin: 24px; }
        body { margin: 0; font-family: -apple-system, Roboto, sans-serif; text-align: center; }
        h1 { font-size: 20px; color: #6B3A2A; margin: 0 0 12px; }
        .pag { page-break-after: always; }
        img { max-width: 100%; max-height: 88vh; object-fit: contain; }
        .rodape { font-size: 11px; color: #999; margin-top: 10px; }
      </style></head>
      <body>
        ${title ? `<h1>${title}</h1>` : ""}
        ${dataUrls.map((d) => `<div class="pag"><img src="${d}" /><div class="rodape">PetsLife</div></div>`).join("")}
      </body></html>`;
    await Print.printAsync({ html });
  } catch (e: any) {
    Alert.alert("Não foi possível imprimir", e?.message ?? "Tente novamente.");
  }
}

/**
 * Cartão de vacinas em PDF, para levar ao veterinário ou guardar.
 * A pessoa carrega no botão e escolhe "Guardar como PDF" ou a impressora.
 */
export async function printVaccineCard(
  pet: { name?: string | null; species?: string | null; breed?: string | null; birthDate?: string | null; chip?: string | null; qrCode?: string | null },
  vaccines: any[],
) {
  try {
    if (!vaccines?.length) {
      Alert.alert("Sem vacinas", "Registe pelo menos uma vacina primeiro.");
      return;
    }
    const esc = (s: any) =>
      String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const hoje = new Date().toLocaleDateString("pt-PT");
    const linhas = vaccines
      .map(
        (v) => `<tr>
          <td><b>${esc(v.name)}</b>${v.batch ? `<div class="s">Lote: ${esc(v.batch)}</div>` : ""}</td>
          <td>${esc(v.date ?? "—")}</td>
          <td>${esc(v.nextDate ?? "—")}</td>
          <td>${esc(v.veterinarian ?? "—")}${v.clinic ? `<div class="s">${esc(v.clinic)}</div>` : ""}</td>
        </tr>`,
      )
      .join("");
    const info = [
      pet.species ? `Espécie: ${esc(pet.species)}` : "",
      pet.breed ? `Raça: ${esc(pet.breed)}` : "",
      pet.birthDate ? `Nascimento: ${esc(pet.birthDate)}` : "",
      pet.chip ? `Chip: ${esc(pet.chip)}` : "",
    ]
      .filter(Boolean)
      .join(" &nbsp;·&nbsp; ");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <style>
        @page { margin: 26px; }
        body { margin: 0; font-family: -apple-system, Roboto, sans-serif; color: #1A1A2E; }
        .top { background: #4ECDC4; color: #fff; border-radius: 14px; padding: 16px 18px; }
        .top h1 { margin: 0; font-size: 21px; }
        .top .n { font-size: 15px; margin-top: 4px; opacity: .95; }
        .info { font-size: 12px; color: #555; margin: 14px 0 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #E8FAF9; text-align: left; padding: 8px; border: 1px solid #CFEDEB; }
        td { padding: 8px; border: 1px solid #E5E7EB; vertical-align: top; }
        .s { font-size: 10px; color: #777; }
        .rodape { margin-top: 18px; font-size: 10px; color: #999; text-align: center; }
      </style></head>
      <body>
        <div class="top">
          <h1>Cartão de Vacinas</h1>
          <div class="n">${esc(pet.name ?? "Animal")}</div>
        </div>
        ${info ? `<div class="info">${info}</div>` : ""}
        <table>
          <tr><th>Vacina</th><th>Administrada</th><th>Próxima</th><th>Veterinário</th></tr>
          ${linhas}
        </table>
        <div class="rodape">Emitido pela app PetsLife em ${hoje} · Documento informativo, não substitui a caderneta oficial</div>
      </body></html>`;
    await Print.printAsync({ html });
  } catch (e: any) {
    Alert.alert("Não foi possível criar o PDF", e?.message ?? "Tente novamente.");
  }
}
