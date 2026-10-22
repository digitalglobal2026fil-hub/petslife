import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Trash2, Send, Camera, Loader2 } from "lucide-react";
import { api as apiTyped } from "../../lib/api";
import { authClient } from "../../lib/auth";
import { uploadImageFile } from "../../lib/upload";
import { RequireAuth, AppShell } from "../../components/AppShell";
const api: any = apiTyped;

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "agora mesmo";
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

function CommentsBox({ postId, myId, onClose }: { postId: string; myId?: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["post-comments", postId], queryFn: async () => (await api.posts[":id"].comments.$get({ param: { id: postId } })).json() });
  const comments = (data as any)?.comments ?? [];

  const send = useMutation({
    mutationFn: async () => (await api.posts[":id"].comments.$post({ param: { id: postId }, json: { content: text } })).json(),
    onSuccess: () => { setText(""); qc.invalidateQueries({ queryKey: ["post-comments", postId] }); qc.invalidateQueries({ queryKey: ["posts"] }); },
  });
  const del = useMutation({
    mutationFn: async (commentId: string) => (await api.posts[":postId"].comments[":commentId"].$delete({ param: { postId, commentId } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["post-comments", postId] }); qc.invalidateQueries({ queryKey: ["posts"] }); },
  });

  return (
    <div className="mt-3 border-t border-[#F0E8E0] pt-3 space-y-2">
      {isLoading ? <Loader2 className="animate-spin text-gray-300" size={16} /> : comments.length === 0 ? (
        <p className="text-xs text-gray-400">Seja o primeiro a comentar!</p>
      ) : comments.map((cm: any) => (
        <div key={cm.id} className="flex gap-2 items-start text-sm">
          {cm.authorImage ? (
            <img src={cm.authorImage} className="w-7 h-7 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#4ECDC4] text-white font-bold flex items-center justify-center text-xs shrink-0">{(cm.authorName ?? cm.userId ?? "?")[0]?.toUpperCase()}</div>
          )}
          <div className="flex-1 bg-[#F8F6FF] rounded-xl px-3 py-2">
            <p className="text-xs font-bold text-[#1A1A2E] flex items-center gap-1">{cm.authorName ?? "Utilizador"}{cm.authorOfficial && <span className="text-[#FF6B35] text-[10px]">✓ Oficial</span>}</p>
            <p className="text-[#1A1A2E]">{cm.content}</p>
            <p className="text-[10px] text-gray-400 mt-1">{cm.createdAt ? timeAgo(cm.createdAt) : ""}</p>
          </div>
          {myId === cm.userId && <button onClick={() => del.mutate(cm.id)} className="text-gray-300 hover:text-red-500 shrink-0"><Trash2 size={13} /></button>}
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva um comentário..." className="flex-1 bg-[#F8F6FF] rounded-xl px-3 py-2 text-sm focus:outline-none" />
        <button onClick={() => text.trim() && send.mutate()} className="text-[#FF6B35]"><Send size={18} /></button>
      </div>
    </div>
  );
}

function CommunityContent() {
  const qc = useQueryClient();
  const { data: session } = authClient.useSession();
  const myId = (session as any)?.user?.id;
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["posts"], queryFn: async () => (await api.posts.$get()).json() });
  const posts = (data as any)?.posts ?? [];

  const create = useMutation({
    mutationFn: async () => (await api.posts.$post({ json: { content, imageUrl: imageUrl || undefined } })).json(),
    onSuccess: () => { setContent(""); setImageUrl(null); qc.invalidateQueries({ queryKey: ["posts"] }); },
  });
  const like = useMutation({
    mutationFn: async (id: string) => (await api.posts[":id"].like.$post({ param: { id } })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await api.posts[":id"].$delete({ param: { id } })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { setImageUrl(await uploadImageFile(file)); } catch { alert("Erro ao carregar imagem."); }
    finally { setUploading(false); }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-6">Comunidade 👥</h1>

      <div className="bg-white rounded-2xl border border-[#F0E8E0] p-4 mb-6">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Partilhe um momento com o seu animal..." rows={3} className="w-full resize-none focus:outline-none text-sm" />
        {imageUrl && <img src={imageUrl} className="rounded-xl mt-2 max-h-48 object-cover" />}
        <div className="flex items-center justify-between mt-3">
          <label className="flex items-center gap-1.5 text-[#4ECDC4] text-sm font-semibold cursor-pointer">
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />} Foto
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
          <button onClick={() => content.trim() && create.mutate()} disabled={create.isPending} className="bg-[#FF6B35] text-white font-bold text-sm px-4 py-2 rounded-xl disabled:opacity-50">Publicar</button>
        </div>
      </div>

      {isLoading ? <Loader2 className="animate-spin text-gray-300 mx-auto" /> : posts.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Ainda não há publicações. Seja a primeira!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((p: any) => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#F0E8E0] p-4">
              <div className="flex items-center gap-2 mb-2">
                {p.authorImage ? (
                  <img src={p.authorImage} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white font-bold flex items-center justify-center text-xs">{(p.authorName ?? p.userId ?? "?")[0]?.toUpperCase()}</div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1A1A2E] flex items-center gap-1">{p.authorName ?? "Utilizador"}{p.authorOfficial && <span className="text-[#FF6B35] text-[10px]">✓ Oficial</span>}</span>
                  <span className="text-xs text-gray-400">{p.createdAt ? timeAgo(p.createdAt) : ""}</span>
                </div>
                {myId === p.userId && <button onClick={() => del.mutate(p.id)} className="ml-auto text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>}
              </div>
              <p className="text-[#1A1A2E] text-sm mb-2 whitespace-pre-wrap">{p.content}</p>
              {p.imageUrl && <img src={p.imageUrl} className="rounded-xl w-full max-h-72 object-cover mb-2" />}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button onClick={() => like.mutate(p.id)} className={`flex items-center gap-1 ${p.likedByMe ? "text-[#EF476F]" : ""}`}>
                  <Heart size={16} fill={p.likedByMe ? "#EF476F" : "none"} /> {p.likesCount ?? 0}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle size={16} /> {p.commentsCount ?? 0}
                </span>
              </div>
              <CommentsBox postId={p.id} myId={myId} onClose={() => setOpenComments(null)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Community() {
  return (
    <RequireAuth>
      <AppShell>
        <CommunityContent />
      </AppShell>
    </RequireAuth>
  );
}
