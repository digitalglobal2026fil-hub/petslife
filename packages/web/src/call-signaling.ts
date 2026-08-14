/**
 * Sinalização WebRTC para as consultas online da PetsLife.
 *
 * PORQUE NÃO USAMOS O JITSI
 * O meet.jit.si passou a exigir que o primeiro participante faça login como
 * moderador ("A conferência ainda não começou porque não chegou nenhum
 * moderador"). Além disso, em Android o link do Jitsi obriga a instalar a app.
 * Ou seja: contas, instalações e confusão — o oposto do que queremos.
 *
 * COMO FUNCIONA AGORA
 * A chamada é directamente entre os dois browsers (WebRTC, ponto a ponto).
 * Este servidor só serve de intermediário para os dois lados trocarem os
 * dados técnicos de ligação (offer/answer/ICE). Não passa vídeo nem áudio por
 * aqui, logo não há custos de largura de banda nem contas de terceiros.
 *
 * Uma sala aceita 2 participantes (dono + veterinário).
 */

type Peer = {
  ws: any;
  id: string;
  name: string;
  roomId: string;
};

const rooms = new Map<string, Peer[]>();

export function handleCallSocket() {
  return {
    open(ws: any) {
      // nada a fazer: esperamos a mensagem "join"
      ws.data = ws.data ?? {};
    },

    message(ws: any, raw: string | Buffer) {
      let msg: any;
      try {
        msg = JSON.parse(typeof raw === "string" ? raw : raw.toString());
      } catch {
        return;
      }

      // ---- entrar na sala ----
      if (msg.type === "join") {
        const roomId = String(msg.roomId ?? "").slice(0, 80);
        if (!roomId) return;

        const peers = rooms.get(roomId) ?? [];

        // Sala cheia: só 2 participantes (dono + vet)
        if (peers.length >= 2) {
          ws.send(JSON.stringify({ type: "room-full" }));
          return;
        }

        const peer: Peer = {
          ws,
          id: crypto.randomUUID(),
          name: String(msg.name ?? "Convidado").slice(0, 40),
          roomId,
        };
        ws.data.peer = peer;
        peers.push(peer);
        rooms.set(roomId, peers);

        const others = peers.filter((p) => p.id !== peer.id);

        // Quem chega em segundo lugar é que inicia a oferta
        ws.send(JSON.stringify({
          type: "joined",
          selfId: peer.id,
          shouldOffer: others.length > 0,
          others: others.map((p) => ({ id: p.id, name: p.name })),
        }));

        // Avisar quem já estava
        for (const other of others) {
          send(other.ws, { type: "peer-joined", id: peer.id, name: peer.name });
        }
        return;
      }

      const peer: Peer | undefined = ws.data?.peer;
      if (!peer) return;

      // ---- reencaminhar sinalização para o outro participante ----
      if (msg.type === "offer" || msg.type === "answer" || msg.type === "ice") {
        const peers = rooms.get(peer.roomId) ?? [];
        for (const other of peers) {
          if (other.id !== peer.id) {
            send(other.ws, { ...msg, from: peer.id, fromName: peer.name });
          }
        }
        return;
      }

      // ---- mensagem de chat dentro da chamada ----
      if (msg.type === "chat") {
        const peers = rooms.get(peer.roomId) ?? [];
        for (const other of peers) {
          if (other.id !== peer.id) {
            send(other.ws, { type: "chat", text: String(msg.text ?? "").slice(0, 500), fromName: peer.name });
          }
        }
        return;
      }
    },

    close(ws: any) {
      const peer: Peer | undefined = ws.data?.peer;
      if (!peer) return;

      const peers = (rooms.get(peer.roomId) ?? []).filter((p) => p.id !== peer.id);
      if (peers.length === 0) rooms.delete(peer.roomId);
      else rooms.set(peer.roomId, peers);

      for (const other of peers) {
        send(other.ws, { type: "peer-left", id: peer.id });
      }
    },
  };
}

function send(ws: any, obj: any) {
  try {
    ws.send(JSON.stringify(obj));
  } catch {
    // participante já desligou
  }
}
