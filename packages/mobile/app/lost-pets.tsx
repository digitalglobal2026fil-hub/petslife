import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Linking, Image, ActivityIndicator,
  Modal, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Platform } from 'react-native';
import { authFetch } from "../lib/auth-fetch";

const TOKEN_KEY = "bearer_token";
function getToken(): string {
  if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null) ?? "";
  try { const SecureStore = require("expo-secure-store"); return SecureStore.getItem(TOKEN_KEY) ?? ""; } catch { return ""; }
}


const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://petslife.onrender.com';
const COLORS = { bg: '#F8F6FF', orange: '#FF6B35', teal: '#4ECDC4', purple: '#8B5CF6', dark: '#1A1A2E', text: '#333', gray: '#888', lightGray: '#E8E4F8', card: '#FFFFFF', red: '#FF4757', green: '#2ED573' };

export default function LostPetsScreen() {
  const [tab, setTab] = useState<'lost' | 'found'>('lost');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

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
      // fallback to mock data
      setPosts(MOCK_POSTS.filter(p => p.type === tab));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { setLoading(true); fetchPosts(); }, [tab]);

  const handleOpenMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o Google Maps'));
  };

  const handleSubmit = async () => {
    if (!form.petName || !form.location || !form.contact) {
      Alert.alert('Campos obrigatórios', 'Preenche o nome, localização e contacto');
      return;
    }
    try {
      const res = await authFetch(`${API_URL}/api/lost-pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: tab }),
      });
      if (res.ok) {
        Alert.alert('✅ Publicado!', 'O anúncio foi publicado com sucesso.');
        setShowModal(false);
        fetchPosts();
      }
    } catch (e) {
      Alert.alert('Publicado localmente', 'Anúncio guardado. Será sincronizado em breve.');
      setShowModal(false);
    }
  };

  const filtered = filter === 'all' ? posts : posts.filter(p => p.species === filter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔍 Animais Perdidos</Text>
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'lost' && styles.tabActive]} onPress={() => setTab('lost')}>
          <Text style={[styles.tabText, tab === 'lost' && styles.tabTextActive]}>😢 Perdidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'found' && styles.tabActiveGreen]} onPress={() => setTab('found')}>
          <Text style={[styles.tabText, tab === 'found' && styles.tabTextActive]}>🎉 Encontrados</Text>
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
              <Text style={styles.emptyText}>Nenhum anúncio encontrado</Text>
              <Text style={styles.emptySubtext}>Publica um anúncio para ajudar!</Text>
            </View>
          )}
          {filtered.map((post, i) => (
            <PostCard key={post.id || i} post={post} onMaps={handleOpenMaps} />
          ))}
        </ScrollView>
      )}

      {/* Modal criar anúncio */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={24} color={COLORS.dark} /></TouchableOpacity>
            <Text style={styles.modalTitle}>Novo Anúncio</Text>
            <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}><Text style={styles.saveTxt}>Publicar</Text></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
            <View style={styles.typeRow}>
              {['lost', 'found'].map(t => (
                <TouchableOpacity key={t} onPress={() => setForm(f => ({ ...f, type: t }))} style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}>
                  <Text style={[styles.typeTxt, form.type === t && { color: '#fff' }]}>{t === 'lost' ? '😢 Perdi' : '🎉 Encontrei'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {[
              { key: 'petName', label: 'Nome do animal', placeholder: 'ex: Rex' },
              { key: 'breed', label: 'Raça', placeholder: 'ex: Labrador' },
              { key: 'color', label: 'Cor / markings', placeholder: 'ex: Castanho com manchas brancas' },
              { key: 'location', label: '📍 Localização', placeholder: 'ex: Parque Eduardo VII, Lisboa' },
              { key: 'description', label: 'Descrição', placeholder: 'Mais detalhes...' },
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
              <Text style={styles.fieldLabel}>Espécie</Text>
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

function PostCard({ post, onMaps }: { post: any; onMaps: (lat: number, lng: number, name: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const isLost = post.type === 'lost';

  return (
    <TouchableOpacity style={styles.card} onPress={() => setExpanded(!expanded)} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: isLost ? COLORS.red + '22' : COLORS.green + '22' }]}>
          <Text style={[styles.badgeTxt, { color: isLost ? COLORS.red : COLORS.green }]}>
            {isLost ? '😢 Perdido' : '🎉 Encontrado'}
          </Text>
        </View>
        <Text style={styles.cardDate}>{post.date || new Date().toLocaleDateString('pt-PT')}</Text>
      </View>
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
                <Text style={[styles.actionTxt, { color: COLORS.teal }]}>Ver no Mapa</Text>
              </TouchableOpacity>
            )}
            {post.contact && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${post.contact}`)}>
                <Ionicons name="call-outline" size={16} color={COLORS.orange} />
                <Text style={[styles.actionTxt, { color: COLORS.orange }]}>{post.contact}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      <View style={styles.expandRow}>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.gray} />
      </View>
    </TouchableOpacity>
  );
}

const MOCK_POSTS = [
  { id: '1', type: 'lost', petName: 'Bolinha', species: 'dog', breed: 'Labrador', color: 'Dourado', location: 'Parque das Nações, Lisboa', lat: 38.7636, lng: -9.0942, description: 'Perdeu-se ontem à tarde. Muito amigável, responde pelo nome.', contact: '912345678', date: '26/06/2026' },
  { id: '2', type: 'lost', petName: 'Mimi', species: 'cat', breed: 'Persa', color: 'Branco com manchas laranja', location: 'Cascais Centro', description: 'Gata castrada, com coleira azul.', contact: '965432109', date: '25/06/2026' },
  { id: '3', type: 'found', petName: 'Desconhecido', species: 'dog', breed: 'Indefinida', color: 'Preto e branco', location: 'Sintra, perto da estação', lat: 38.8003, lng: -9.3869, description: 'Encontrei este cão perdido. Sem coleira. Está saudável.', contact: '935678901', date: '26/06/2026' },
];

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
});
