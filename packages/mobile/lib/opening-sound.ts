import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { kvGet, kvSet } from "./kv";

/**
 * Musiquinha de abertura (ukulele alegre, ~10 s) — a mesma melodia do
 * vídeo promocional, para dar coerência à marca.
 *
 * Regras:
 *  - toca UMA única vez por arranque a frio da app (a flag `jaTocou` vive
 *    no módulo, por isso reinicia só quando o processo morre);
 *  - volume baixo e suave (28%), só um fundo — acompanha o ecrã de abertura
 *    até entrar na app, e desce gradualmente (fade-out) no último segundo
 *    e meio para não cortar de repente;
 *  - `playsInSilentMode: false` — no iOS, se o telemóvel estiver em
 *    silêncio, não toca nada;
 *  - a pessoa pode desligar no Perfil ("Som de abertura"). A preferência
 *    fica guardada no expo-secure-store (lib/kv.ts).
 *
 * NOTA: não usar expo-av (foi descontinuado) nem async-storage.
 */

const CHAVE = "som_abertura";
const SOM = require("../assets/opening.mp3");
const VOLUME_BASE = 0.28;

let jaTocou = false;
let player: AudioPlayer | null = null;

/** Desce o volume gradualmente até 0, em passos pequenos, para não cortar
 * a música de repente (fade-out suave nos últimos ~1.5 s). */
function iniciarFadeOut(p: AudioPlayer, passos = 12, duracaoMs = 1500) {
  const intervalo = duracaoMs / passos;
  let passo = 0;
  const id = setInterval(() => {
    passo++;
    try {
      p.volume = Math.max(0, VOLUME_BASE * (1 - passo / passos));
    } catch {
      clearInterval(id);
    }
    if (passo >= passos) clearInterval(id);
  }, intervalo);
}

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
    player.volume = VOLUME_BASE;
    player.play();
    // Começa a desaparecer suavemente pouco antes do fim (10 s de música).
    setTimeout(() => {
      if (player) iniciarFadeOut(player);
    }, 8500);
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
    p.volume = VOLUME_BASE;
    p.play();
    setTimeout(() => {
      iniciarFadeOut(p);
    }, 8500);
    setTimeout(() => {
      try {
        p.remove();
      } catch {}
    }, 11000);
  } catch {}
}
