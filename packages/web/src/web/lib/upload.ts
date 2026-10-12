import { api } from "./api";

/** Redimensiona a imagem no browser (máx 1280px) e envia em base64 para /api/upload/image. */
export async function uploadImageFile(file: File): Promise<string> {
  const dataUrl = await resizeImage(file, 1280, 0.82);
  const base64 = dataUrl.split(",")[1] ?? "";
  const mimeMatch = dataUrl.match(/^data:(.*?);/);
  const mimeType = mimeMatch?.[1] ?? "image/jpeg";
  const res = await api.upload.image.$post({ json: { base64, mimeType } });
  const data = await res.json();
  if (!res.ok || !("url" in data)) throw new Error((data as any)?.error ?? "Falha no upload");
  return (data as any).url as string;
}

function resizeImage(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem"));
    reader.onload = () => {
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas não suportado"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Imagem inválida"));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
