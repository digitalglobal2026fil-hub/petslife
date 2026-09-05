import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { kvGet, kvSet } from "./kv";

/**
 * Musiquinha de abertura (ukulele alegre, ~10 s) — a mesma melodia do
 * vídeo promocional, para dar coerência à marca.
 *
 * Regras:
 *  - toca UMA única vez por arranque a frio da app (a flag `jaTocou` vive
 *    no módulo, por isso reinicia só quando o processo morre);
 *  - volume moderado (60%), acompanha o ecrã de abertura até entrar na app;
 *  - `playsInSilentMode: false` — no iOS, se o telemóvel estiver em
 *    silêncio, não toca nada;
 *  - a pessoa pode desligar no Perfil ("Som de abertura"). A preferência
 *    fica guardada no expo-secure-store (lib/kv.ts).
 *
 * NOTA: não usar expo-av (foi descontinuado) nem async-storage.
 */

const CHAVE = "som_abertura";
const SOM = require("../assets/opening.mp3");

let jaTocou = false;
let player: AudioPlayer | null = null;

/** Está ligado? (por omissão sim) */
export async function somAberturaLigado(): Promise<boolean> {
  const v = await kvGet(CHAVE);
  return v !== "0";
}

/** Liga ou desliga a musiquinha. */
export async function definirSomAbertura(ligado: boolean): Promise<void> {
  await kvSet(CHAVE, ligado ? "1" : "0");
}

/**
 * Toca a musiquinha, se estiver ligada e ainda não tiver tocado neste
 * arranque. Nunca lança erro — se o áudio falhar, a app segue igual.
 */
export async function tocarAberturaUmaVez(): Promise<void> {
  if (jaTocou) return;
  jaTocou = true;
  try {
    if (!(await somAberturaLigado())) return;
    await setAudioModeAsync({
      playsInSilentMode: false,
      shouldPlayInBackground: false,
      interruptionMode: "mixWithOthers",
    });
    player = createAudioPlayer(SOM);
    player.volume = 0.6;
    player.play();
    // Liberta o recurso quando a música acaba (10 s + margem).
    setTimeout(() => {
      try {
        player?.remove();
      } catch {}
      player = null;
    }, 11000);
  } catch {
    /* sem som é melhor do que app a rebentar */
  }
}

/** Ouvir a musiquinha ao mexer no interruptor do Perfil. */
export async function experimentarAbertura(): Promise<void> {
  try {
    await setAudioModeAsync({ playsInSilentMode: false, shouldPlayInBackground: false });
    const p = createAudioPlayer(SOM);
    p.volume = 0.6;
    p.play();
    setTimeout(() => {
      try {
        p.remove();
      } catch {}
    }, 11000);
  } catch {}
}
