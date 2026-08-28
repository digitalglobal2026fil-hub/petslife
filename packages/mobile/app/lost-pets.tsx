import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Linking, Image, ActivityIndicator,
  Modal, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ModerationButton } from "../components/ModerationButton";
import { deleteContent } from "../lib/moderation";

import { Platform, Share } from 'react-native';
import { authFetch } from "../lib/auth-fetch";
import { tr } from "../lib/i18n";
import { uploadImage } from "../lib/upload";
import { pickImageWithChoice } from "../lib/pick-image";

const TOKEN_KEY = "bearer_token";
function getToken(): string {
  if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null) ?? "";
  try { const SecureStore = require("expo-secure-store"); return SecureStore.getItem(TOKEN_KEY) ?? ""; } catch { return ""; }
}


const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://petslife.onrender.com';
const COLORS = { bg: '#F8F6FF', orange: '#FF6B35', teal: '#4ECDC4', purple: '#8B5CF6', dark: '#1A1A2E', text: '#333', gray: '#888', lightGray: '#E8E4F8', card: '#FFFFFF', red: '#FF4757', green: '#2ED573' };

// Texto do cartaz para partilhar no WhatsApp, Facebook ou onde a pessoa quiser.
// O contacto é só o que ela escrever no texto — não vai nada da conta dela.
function posterText(post: any) {
  const linhas = [
    post.type === 'found' ? '🎉 ANIMAL ENCONTRADO' : '🚨 ANIMAL PERDIDO 🚨',
    '',
    post.petName ? `Nome: ${post.petName}` : '',
    post.breed ? `Raça: ${post.breed}` : '',
    post.color ? `Cor: ${post.color}` : '',
    post.location ? `📍 ${post.location}` : '',
    '',
    post.description || '',
    '',
    post.photo1 ? `Foto: ${post.photo1}` : '',
    post.photo2 ? `Foto: ${post.photo2}` : '',
    '',
    'Partilhado pela app PetsLife 🐾',
  ];
  return linhas.filter(l => l !== '').join('\n');
}

async function sharePoster(post: any) {
  const message = posterText(post);
  try {
    await Share.share({ message });
  } catch {
    Alert.alert(tr("Erro"), tr("Não foi possível abrir a partilha."));
  }
}

function shareWhatsApp(post: any) {
  const url = `whatsapp://send?text=${encodeURIComponent(posterText(post))}`;
  Linking.openURL(url).catch(() => sharePoster(post));
}

function shareFacebook(post: any) {
  // O Facebook não aceita texto pré-escrito por link, por isso copiamos
  // o cartaz para a folha de partilha do telefone, onde o Facebook aparece.
  sharePoster(post);
}

export default function LostPetsScreen() {
  const [tab, setTab] = useState<'lost' | 'found'>('lost');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  // Cartaz: até 2 fotos e o animal escolhido da lista da utilizadora.
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [myPets, setMyPets] = useState<any[]>([]);
  const [petId, setPetId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    type: 'lost',
    petName: '',
    species: 'dog',
    breed: '',
    color: '',
    location: '',
    lat: '',
    lng: '',
    description: '',
    contact: '',
  });

  const fetchPosts = async () => {
    try {
      const res = await authFetch(`${API_URL}/api/lost-pets?type=${tab}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      // sem internet: fica a lista vazia em vez de mostrar exemplos inventados
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { setLoading(true); fetchPosts(); }, [tab]);

  // Lista de animais da utilizadora, para ela escolher qual se perdeu
  // em vez de escrever tudo à mão.
  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/api/pets`);
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.pets ?? []);
        setMyPets(Array.isArray(list) ? list : []);
      } catch {
        /* sem lista: ela escreve à mão */
      }
    })();
  }, []);

  // Ao escolher um animal, preenchemos o que já sabemos dele.
  const choosePet = (pet: any) => {
    if (petId === String(pet.id)) {
      setPetId(null);
      return;
    }
    setPetId(String(pet.id));
    setForm(f => ({
      ...f,
      petName: pet.name || f.petName,
      species: pet.species || f.species,
      breed: pet.breed || f.breed,
    }));
    if (pet.photoUrl && photos.length === 0) setPhotos([pet.photoUrl]);
  };

  const addPhoto = async () => {
    if (photos.length >= 2) {
      Alert.alert(tr("Máximo 2 fotos"), tr("Já tens 2 fotos. Remove uma para escolher outra."));
      return;
    }
    try {
      const asset = await pickImageWithChoice({ title: tr("Foto do animal"), quality: 0.8 });
      if (!asset) return;
      setUploading(true);
      try {
        const url = await uploadImage(asset.uri, asset.mimeType ?? "image/jpeg");
        setPhotos(p => [...p, url].slice(0, 2));
      } catch {
        Alert.alert(tr("Erro"), tr("Não foi possível fazer upload da foto."));
      } finally {
        setUploading(false);
      }
    } catch (e: any) {
      setUploading(false);
      Alert.alert(tr("Erro ao escolher foto"), e?.message ?? tr("Tenta novamente ou escolhe outra imagem."));
    }
  };

  const handleOpenMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => Alert.alert(tr("Erro"), tr("Não foi possível abrir o Google Maps")));
  };

  const handleSubmit = async () => {
    if (!form.petName || !form.description) {
      Alert.alert(
        tr("Falta preencher"),
        tr("Escreve o nome do animal e o texto do cartaz (onde se perdeu e o teu contacto).")
      );
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const res = await authFetch(`${API_URL}/api/lost-pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: tab,
          petId,
          photo1: photos[0] ?? null,
          photo2: photos[1] ?? null,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setPhotos([]);
        setPetId(null);
        setForm(f => ({ ...f, petName: '', breed: '', color: '', location: '', description: '', contact: '' }));
        fetchPosts();
        Alert.alert(
          tr("Cartaz publicado"),
          tr("Já está visível para todos. Agora partilha-o no WhatsApp e no Facebook para chegar a mais gente."),
          [{ text: tr("Partilhar agora"), onPress: () => sharePoster({ ...form, photo1: photos[0] }) }, { text: tr("Depois") }]
        );
      } else {
        Alert.alert(tr("Erro"), tr("Não foi possível publicar. Verifica a ligação à internet e tenta outra vez."));
      }
    } catch (e) {
      Alert.alert(tr("Sem internet"), tr("Não foi possível publicar agora. Tenta outra vez quando tiveres ligação."));
    } finally {
      setSaving(false);
    }
  };

  const filtered = filter === 'all' ? posts : posts.filter(p => p.species === filter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr("🔍 Animais Perdidos")}</Text>
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'lost' && styles.tabActive]} onPress={() => setTab('lost')}>
          <Text style={[styles.tabText, tab === 'lost' && styles.tabTextActive]}>{tr("😢 Perdidos")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'found' && styles.tabActiveGreen]} onPress={() => setTab('found')}>
          <Text style={[styles.tabText, tab === 'found' && styles.tabTextActive]}>{tr("🎉 Encontrados")}</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {['all', 'dog', 'cat', 'bird', 'other'].map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, filter === f && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Todos' : f === 'dog' ? '🐶 Cão' : f === 'cat' ? '🐱 Gato' : f === 'bird' ? '🐦 Pássaro' : '🐾 Outro'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.orange} /></View>
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPosts(); }} />} contentContainerStyle={{ padding: 16, gap: 12 }}>
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🐾</Text>
              <Text style={styles.emptyText}>{tr("Nenhum anúncio encontrado")}</Text>
              <Text style={styles.emptySubtext}>{tr("Publica um anúncio para ajudar!")}</Text>
            </View>
          )}
          {filtered.map((post, i) => (
            <PostCard
              key={post.id || i}
              post={post}
              onMaps={handleOpenMaps}
              onDelete={async () => {
                const ok = await deleteContent("lost_pet", String(post.id));
                if (ok) fetchPosts();
              }}
              onResolved={fetchPosts}
            />
          ))}
        </ScrollView>
      )}

      {/* Modal criar anúncio */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={24} color={COLORS.dark} /></TouchableOpacity>
            <Text style={styles.modalTitle}>{tr("Novo Anúncio")}</Text>
            <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}><Text style={styles.saveTxt}>{tr("Publicar")}</Text></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
            <View style={styles.typeRow}>
              {['lost', 'found'].map(t => (
                <TouchableOpacity key={t} onPress={() => setForm(f => ({ ...f, type: t }))} style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}>
                  <Text style={[styles.typeTxt, form.type === t && { color: '#fff' }]}>{t === 'lost' ? '😢 Perdi' : '🎉 Encontrei'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Escolher um dos animais dela — poupa-lhe escrever tudo à mão */}
            {myPets.length > 0 && (
              <View>
                <Text style={styles.fieldLabel}>{tr("Qual dos teus animais?")}</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {myPets.map((p: any) => (
                    <TouchableOpacity
                      key={String(p.id)}
                      onPress={() => choosePet(p)}
                      style={[styles.filterChip, petId === String(p.id) && styles.filterChipActive]}
                    >
                      <Text style={[styles.filterText, petId === String(p.id) && styles.filterTextActive]}>
                        {p.name || tr("Sem nome")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Até 2 fotos */}
            <View>
              <Text style={styles.fieldLabel}>{tr("Fotos (até 2)")}</Text>
              <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                {photos.map((uri, idx) => (
                  <View key={idx} style={styles.photoBox}>
                    <Image source={{ uri }} style={styles.photoImg} />
                    <TouchableOpacity
                      style={styles.photoRemove}
                      onPress={() => setPhotos(p => p.filter((_, i) => i !== idx))}
                    >
                      <Ionicons name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                {photos.length < 2 && (
                  <TouchableOpacity style={styles.photoAdd} onPress={addPhoto} disabled={uploading}>
                    {uploading ? (
                      <ActivityIndicator color={COLORS.orange} />
                    ) : (
                      <>
                        <Ionicons name="camera-outline" size={26} color={COLORS.orange} />
                        <Text style={styles.photoAddTxt}>{tr("Juntar foto")}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {[
              { key: 'petName', label: 'Nome do animal', placeholder: 'ex: Rex' },
              { key: 'breed', label: tr("Raça"), placeholder: 'ex: Labrador' },
              { key: 'color', label: 'Cor / markings', placeholder: 'ex: Castanho com manchas brancas' },
              { key: 'location', label: '📍 Localização', placeholder: 'ex: Parque Eduardo VII, Lisboa' },
              { key: 'description', label: tr("Descrição"), placeholder: 'Mais detalhes...' },
              { key: 'contact', label: '📞 Contacto', placeholder: 'Telemóvel ou email' },
            ].map(field => (
              <View key={field.key}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  value={(form as any)[field.key]}
                  onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
                  placeholder={field.placeholder}
                  multiline={field.key === 'description'}
                />
              </View>
            ))}
            <View>
              <Text style={styles.fieldLabel}>{tr("Espécie")}</Text>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {['dog', 'cat', 'bird', 'other'].map(s => (
                  <TouchableOpacity key={s} onPress={() => setForm(f => ({ ...f, species: s }))} style={[styles.filterChip, form.species === s && styles.filterChipActive]}>
                    <Text style={[styles.filterText, form.species === s && styles.filterTextActive]}>
                      {s === 'dog' ? '🐶 Cão' : s === 'cat' ? '🐱 Gato' : s === 'bird' ? '🐦 Pássaro' : '🐾 Outro'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function PostCard({ post, onMaps, onDelete, onResolved }: { post: any; onMaps: (lat: number, lng: number, name: string) => void; onDelete: () => void; onResolved?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const isLost = post.type === 'lost';
  const fotos = [post.photo1, post.photo2].filter(Boolean);

  const marcarEncontrado = () => {
    Alert.alert(
      tr("Já encontrei"),
      tr("Queres fechar este aviso? Deixa de aparecer na lista."),
      [
        { text: tr("Não") },
        {
          text: tr("Sim, já encontrei"),
          onPress: async () => {
            try {
              const res = await authFetch(`${API_URL}/api/lost-pets/${post.id}/resolve`, { method: 'PATCH' });
              if (res.ok) {
                Alert.alert(tr("Que bom!"), tr("O aviso foi fechado. Ficamos felizes pelo reencontro."));
                onResolved?.();
              } else {
                Alert.alert(tr("Erro"), tr("Não foi possível fechar o aviso. Tenta outra vez."));
              }
            } catch {
              Alert.alert(tr("Sem internet"), tr("Tenta outra vez quando tiveres ligação."));
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => setExpanded(!expanded)} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: isLost ? COLORS.red + '22' : COLORS.green + '22' }]}>
          <Text style={[styles.badgeTxt, { color: isLost ? COLORS.red : COLORS.green }]}>
            {isLost ? '😢 Perdido' : '🎉 Encontrado'}
          </Text>
        </View>
        <Text style={styles.cardDate}>{post.date || new Date().toLocaleDateString('pt-PT')}</Text>
        <ModerationButton
          target="lost_pet"
          targetId={String(post.id)}
          preview={post.petName || ''}
          label={tr("este anúncio")}
          onDelete={onDelete}
        />
      </View>
      {fotos.length > 0 && (
        <View style={styles.cardPhotoRow}>
          {fotos.map((uri: string, i: number) => (
            <Image key={i} source={{ uri }} style={styles.cardPhoto} />
          ))}
        </View>
      )}
      <Text style={styles.cardName}>{post.petName || 'Animal sem nome'}</Text>
      <Text style={styles.cardBreed}>{post.breed || post.species || 'Espécie desconhecida'} • {post.color || ''}</Text>
      <View style={styles.cardLoc}>
        <Ionicons name="location-outline" size={14} color={COLORS.orange} />
        <Text style={styles.cardLocTxt}>{post.location || 'Localização não especificada'}</Text>
      </View>
      {expanded && (
        <View style={{ marginTop: 10, gap: 8 }}>
          {post.description && <Text style={styles.cardDesc}>{post.description}</Text>}
          <View style={styles.actionRow}>
            {post.lat && post.lng && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => onMaps(post.lat, post.lng, post.petName)}>
                <Ionicons name="map-outline" size={16} color={COLORS.teal} />
                <Text style={[styles.actionTxt, { color: COLORS.teal }]}>{tr("Ver no Mapa")}</Text>
              </TouchableOpacity>
            )}
            {post.contact && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${post.contact}`)}>
                <Ionicons name="call-outline" size={16} color={COLORS.orange} />
                <Text style={[styles.actionTxt, { color: COLORS.orange }]}>{post.contact}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Partilhar o cartaz — é isto que faz o animal aparecer */}
          <TouchableOpacity style={styles.shareBtn} onPress={() => shareWhatsApp(post)}>
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.shareBtnTxt}>{tr("Partilhar no WhatsApp")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtnAlt} onPress={() => shareFacebook(post)}>
            <Ionicons name="share-social-outline" size={18} color="#fff" />
            <Text style={styles.shareBtnTxt}>{tr("Partilhar no Facebook ou noutra app")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.foundBtn} onPress={marcarEncontrado}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.shareBtnTxt}>{tr("Já encontrei")}</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.expandRow}>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.gray} />
      </View>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0EDF8' },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: COLORS.dark },
  addBtn: { backgroundColor: COLORS.orange, borderRadius: 20, padding: 8 },
  tabRow: { flexDirection: 'row', margin: 16, backgroundColor: '#fff', borderRadius: 14, padding: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.red },
  tabActiveGreen: { backgroundColor: COLORS.green },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.gray },
  tabTextActive: { color: '#fff' },
  filterRow: { marginBottom: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0D8F8' },
  filterChipActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  filterText: { fontSize: 13, color: COLORS.text },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: COLORS.dark },
  emptySubtext: { fontSize: 13, color: COLORS.gray, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeTxt: { fontSize: 12, fontWeight: '700' },
  cardDate: { fontSize: 12, color: COLORS.gray },
  cardName: { fontSize: 18, fontWeight: '800', color: COLORS.dark, marginBottom: 2 },
  cardBreed: { fontSize: 13, color: COLORS.gray, marginBottom: 6 },
  cardLoc: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardLocTxt: { fontSize: 13, color: COLORS.text },
  cardDesc: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.bg, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  actionTxt: { fontSize: 13, fontWeight: '600' },
  expandRow: { alignItems: 'center', marginTop: 8 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0EDF8' },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark },
  saveBtn: { backgroundColor: COLORS.orange, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  saveTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, borderWidth: 2, borderColor: COLORS.lightGray },
  typeBtnActive: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  typeTxt: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.dark, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E0D8F8', borderRadius: 10, padding: 12, fontSize: 14, color: COLORS.dark, backgroundColor: COLORS.bg },
  photoBox: { width: 96, height: 96, borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: COLORS.lightGray },
  photoImg: { width: '100%', height: '100%' },
  photoRemove: { position: 'absolute', top: 4, right: 4, backgroundColor: COLORS.red, borderRadius: 10, padding: 3 },
  photoAdd: { width: 96, height: 96, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.orange, alignItems: 'center', justifyContent: 'center', gap: 4 },
  photoAddTxt: { fontSize: 11, color: COLORS.orange, fontWeight: '600' },
  cardPhotoRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  cardPhoto: { width: 110, height: 110, borderRadius: 12, backgroundColor: COLORS.lightGray },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 12 },
  shareBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  shareBtnAlt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.purple, paddingVertical: 12, borderRadius: 12 },
  foundBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.green, paddingVertical: 12, borderRadius: 12 },
});
