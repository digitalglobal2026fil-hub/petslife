import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MessageSquare, Send, RefreshCw } from "lucide-react";

/**
 * Sala de videochamada da PetsLife — consulta veterinária online.
 *
 * PORQUE ESTA PÁGINA EXISTE
 * Antes a app abria `https://meet.jit.si/<sala>`. Isso tinha dois problemas:
 *  1. em Android o browser obrigava a instalar a app do Jitsi e, depois de
 *     instalada, o link deixava de servir — era preciso procurar a sala à mão;
 *  2. o meet.jit.si passou a exigir que o primeiro participante faça login
 *     como moderador, ou seja: era preciso uma conta.
 *
 * Agora a chamada é directamente entre os dois browsers (WebRTC). Esta página
 * abre no Chrome/Safari, sem instalar nada e sem contas. O nosso servidor só
 * apresenta os dois lados um ao outro; o vídeo não passa por ele.
 */

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  // TURN público gratuito: necessário quando os dois lados estão atrás de
  // redes que bloqueiam ligação directa (algumas redes móveis).
  {
    urls: [
      "turn:openrelay.metered.ca:80",
      "turn:openrelay.metered.ca:443",
      "turn:openrelay.metered.ca:443?transport=tcp",
    ],
    username: "openrelayproject",
    credential: "openrelayproject",
  },
];

type Phase = "form" | "connecting" | "waiting" | "live" | "ended" | "full" | "error";

export default function CallPage() {
  const roomId = window.location.pathname.split("/").filter(Boolean).pop() ?? "";

  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [peerName, setPeerName] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<{ me: boolean; text: string }[]>([]);
  const [chatDraft, setChatDraft] = useState("");

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pendingIce = useRef<any[]>([]);

  const cleanup = useCallback(() => {
    try { pcRef.current?.close(); } catch {}
    try { wsRef.current?.close(); } catch {}
    streamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current = null;
    wsRef.current = null;
    streamRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  function createPeerConnection() {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    streamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, streamRef.current!);
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        wsRef.current?.send(JSON.stringify({ type: "ice", candidate: e.candidate }));
      }
    };

    pc.ontrack = (e) => {
      if (remoteVideo.current && e.streams[0]) {
        remoteVideo.current.srcObject = e.streams[0];
        setPhase("live");
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed") {
        setErrorMsg("A ligação falhou. Verifique a internet e tente novamente.");
        setPhase("error");
      }
      if (pc.connectionState === "disconnected") setPhase("waiting");
    };

    pcRef.current = pc;
    return pc;
  }

  async function start() {
    if (!name.trim()) return;
    setPhase("connecting");

    // 1. câmara e microfone
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, facingMode: "user" },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;
    } catch (e: any) {
      setErrorMsg(
        e?.name === "NotAllowedError"
          ? "Precisamos de autorização para usar a câmara e o microfone. Toque no ícone do cadeado na barra de endereço e permita o acesso."
          : "Não foi possível aceder à câmara ou ao microfone. Verifique se outra aplicação os está a usar."
      );
      setPhase("error");
      return;
    }

    // 2. ligar à sala
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/ws/call`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", roomId, name: name.trim() }));
    };

    ws.onerror = () => {
      setErrorMsg("Não foi possível ligar ao servidor da consulta.");
      setPhase("error");
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "room-full") {
        setPhase("full");
        cleanup();
        return;
      }

      if (msg.type === "joined") {
        setPhase(msg.others?.length ? "connecting" : "waiting");
        if (msg.others?.length) setPeerName(msg.others[0].name);
        const pc = createPeerConnection();
        if (msg.shouldOffer) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.send(JSON.stringify({ type: "offer", sdp: offer }));
        }
        return;
      }

      if (msg.type === "peer-joined") {
        setPeerName(msg.name);
        return;
      }

      if (msg.type === "offer") {
        const pc = pcRef.current ?? createPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        for (const c of pendingIce.current) await pc.addIceCandidate(c).catch(() => {});
        pendingIce.current = [];
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: "answer", sdp: answer }));
        if (msg.fromName) setPeerName(msg.fromName);
        return;
      }

      if (msg.type === "answer") {
        const pc = pcRef.current;
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        for (const c of pendingIce.current) await pc.addIceCandidate(c).catch(() => {});
        pendingIce.current = [];
        return;
      }

      if (msg.type === "ice") {
        const pc = pcRef.current;
        const candidate = new RTCIceCandidate(msg.candidate);
        if (pc?.remoteDescription?.type) await pc.addIceCandidate(candidate).catch(() => {});
        else pendingIce.current.push(candidate);
        return;
      }

      if (msg.type === "chat") {
        setChatMsgs((m) => [...m, { me: false, text: msg.text }]);
        setShowChat(true);
        return;
      }

      if (msg.type === "peer-left") {
        setPeerName("");
        setPhase("waiting");
        if (remoteVideo.current) remoteVideo.current.srcObject = null;
        return;
      }
    };
  }

  function toggleMic() {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  }

  function toggleCam() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  }

  function hangUp() {
    cleanup();
    setPhase("ended");
  }

  function sendChat() {
    const text = chatDraft.trim();
    if (!text) return;
    wsRef.current?.send(JSON.stringify({ type: "chat", text }));
    setChatMsgs((m) => [...m, { me: true, text }]);
    setChatDraft("");
  }

  // ---------- ecrãs de estado ----------

  if (phase === "form") {
    return (
      <Shell>
        <div style={{ fontSize: 46, marginBottom: 6 }}>🩺</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 23, color: "#1A1A2E" }}>Consulta veterinária online</h1>
        <p style={{ color: "#6B7280", margin: "0 0 22px", fontSize: 14, lineHeight: 1.55 }}>
          Escreva o seu nome e entre. A chamada abre aqui mesmo, no browser —
          sem instalar aplicações e sem criar contas.
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && start()}
          placeholder="O seu nome"
          style={inputStyle}
        />
        <button onClick={start} disabled={!name.trim()} style={btnStyle(!!name.trim())}>
          Entrar na consulta
        </button>
        <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 18, lineHeight: 1.5 }}>
          O browser vai pedir autorização para a câmara e o microfone.
          Toque em <strong>Permitir</strong>.
        </p>
      </Shell>
    );
  }

  if (phase === "full") {
    return (
      <Shell>
        <div style={{ fontSize: 42 }}>🚪</div>
        <h2 style={{ color: "#1A1A2E", fontSize: 20 }}>A sala já tem duas pessoas</h2>
        <p style={{ color: "#6B7280", fontSize: 14 }}>
          Esta consulta é entre o dono do animal e o veterinário. Tente mais tarde.
        </p>
      </Shell>
    );
  }

  if (phase === "ended") {
    return (
      <Shell>
        <div style={{ fontSize: 42 }}>🐾</div>
        <h2 style={{ color: "#1A1A2E", fontSize: 20 }}>Consulta terminada</h2>
        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>
          Pode voltar a entrar com o mesmo link se precisar.
        </p>
        <button onClick={() => { setPhase("form"); setChatMsgs([]); }} style={btnStyle(true)}>
          Entrar outra vez
        </button>
      </Shell>
    );
  }

  if (phase === "error") {
    return (
      <Shell>
        <div style={{ fontSize: 42 }}>⚠️</div>
        <h2 style={{ color: "#EF476F", fontSize: 19 }}>Não foi possível entrar</h2>
        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20, lineHeight: 1.55 }}>{errorMsg}</p>
        <button onClick={() => { cleanup(); setPhase("form"); }} style={btnStyle(true)}>
          <RefreshCw size={16} style={{ verticalAlign: "-3px", marginRight: 8 }} />
          Tentar novamente
        </button>
      </Shell>
    );
  }

  // ---------- chamada ----------
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0B0B12", overflow: "hidden" }}>
      {/* Esconde badges/modais externos que ficavam por cima dos controlos */}
      <style>{`
        .dev-modal, #runable-badge, [class*="runable-badge"], [id*="runable-badge"],
        a[href*="runable"], div[style*="Made with"] { display: none !important; }
        body > div:not(#root), body > a, body > iframe:not([data-call]) { display: none !important; }
      `}</style>
      {/* vídeo do outro participante */}
      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", background: "#0B0B12" }}
      />

      {/* à espera */}
      {phase !== "live" && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", color: "#fff", textAlign: "center", padding: 24,
        }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🐾</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 19 }}>
            {phase === "connecting" ? "A ligar..." : "À espera do outro participante"}
          </h3>
          <p style={{ color: "#9CA3AF", fontSize: 13, maxWidth: 320, lineHeight: 1.5 }}>
            Partilhe este link com o veterinário. Assim que ele entrar, a chamada começa.
          </p>
          <div style={{
            marginTop: 16, background: "rgba(255,255,255,.08)", padding: "10px 14px",
            borderRadius: 10, fontSize: 12, color: "#D1D5DB", wordBreak: "break-all", maxWidth: 340,
          }}>
            {window.location.href}
          </div>
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            style={{
              marginTop: 12, background: "#FF6B35", color: "#fff", border: "none",
              padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            Copiar link
          </button>
        </div>
      )}

      {/* nome do participante */}
      {peerName && phase === "live" && (
        <div style={{
          position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,.55)",
          color: "#fff", padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600,
        }}>
          {peerName}
        </div>
      )}

      {/* o meu vídeo */}
      <video
        ref={localVideo}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute", top: 16, right: 16, width: 108, height: 148,
          objectFit: "cover", borderRadius: 14, border: "2px solid rgba(255,255,255,.25)",
          background: "#1F2937",
        }}
      />

      {/* chat */}
      {showChat && (
        <div style={{
          position: "absolute", bottom: 104, left: 12, right: 12, maxHeight: "42%",
          background: "rgba(11,11,18,.92)", borderRadius: 16, padding: 12, display: "flex",
          flexDirection: "column", gap: 8,
        }}>
          <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {chatMsgs.length === 0 && (
              <p style={{ color: "#6B7280", fontSize: 12, margin: 0 }}>Sem mensagens ainda.</p>
            )}
            {chatMsgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.me ? "flex-end" : "flex-start",
                background: m.me ? "#FF6B35" : "rgba(255,255,255,.12)",
                color: "#fff", padding: "7px 11px", borderRadius: 12, fontSize: 13, maxWidth: "78%",
              }}>
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Escrever mensagem..."
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 10, border: "none",
                background: "rgba(255,255,255,.1)", color: "#fff", fontSize: 13, outline: "none",
              }}
            />
            <button onClick={sendChat} style={{
              background: "#FF6B35", border: "none", borderRadius: 10, width: 42,
              display: "grid", placeItems: "center", cursor: "pointer",
            }}>
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* botões */}
      <div style={{
        position: "absolute", bottom: "calc(96px + env(safe-area-inset-bottom))", left: 0, right: 0, display: "flex",
        justifyContent: "center", gap: 14, zIndex: 2147483647, pointerEvents: "auto",
      }}>
        <RoundBtn onClick={toggleMic} bg={micOn ? "rgba(255,255,255,.14)" : "#EF476F"}>
          {micOn ? <Mic size={22} color="#fff" /> : <MicOff size={22} color="#fff" />}
        </RoundBtn>
        <RoundBtn onClick={toggleCam} bg={camOn ? "rgba(255,255,255,.14)" : "#EF476F"}>
          {camOn ? <VideoIcon size={22} color="#fff" /> : <VideoOff size={22} color="#fff" />}
        </RoundBtn>
        <RoundBtn onClick={() => setShowChat((v) => !v)} bg="rgba(255,255,255,.14)">
          <MessageSquare size={22} color="#fff" />
        </RoundBtn>
        <RoundBtn onClick={hangUp} bg="#EF476F">
          <PhoneOff size={22} color="#fff" />
        </RoundBtn>
      </div>
    </div>
  );
}

function RoundBtn({ children, onClick, bg }: { children: React.ReactNode; onClick: () => void; bg: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 56, height: 56, borderRadius: 28, border: "none", background: bg,
        display: "grid", placeItems: "center", cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 12,
  border: "1.5px solid #E5E7EB", marginBottom: 12, boxSizing: "border-box",
};

const btnStyle = (active: boolean): React.CSSProperties => ({
  width: "100%", padding: 16, fontSize: 16, fontWeight: 800, color: "#fff",
  background: active ? "#FF6B35" : "#D1D5DB", border: "none", borderRadius: 14,
  cursor: active ? "pointer" : "default",
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#FFF9F5", padding: 20, fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{
        background: "#fff", padding: 32, borderRadius: 24, maxWidth: 420, width: "100%",
        textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,.08)",
      }}>
        {children}
      </div>
    </div>
  );
}
