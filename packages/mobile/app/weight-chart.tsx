import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Animated, ActivityIndicator, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { Platform } from 'react-native';

const TOKEN_KEY = "bearer_token";
function getToken(): string {
  if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null) ?? "";
  try { const SecureStore = require("expo-secure-store"); return SecureStore.getItem(TOKEN_KEY) ?? ""; } catch { return ""; }
}


const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://petslife.onrender.com';
const COLORS = { bg: '#F8F6FF', orange: '#FF6B35', teal: '#4ECDC4', purple: '#8B5CF6', dark: '#1A1A2E', text: '#333', gray: '#888', lightGray: '#E8E4F8', card: '#FFFFFF', green: '#2ED573', red: '#FF4757' };

function AnimatedBar({ value, maxValue, color, label, delay }: { value: number; maxValue: number; color: string; label: string; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const height = maxValue > 0 ? (value / maxValue) * 120 : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(anim, { toValue: height, useNativeDriver: false, tension: 50, friction: 8 }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [height, delay]);

  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: 10, color: COLORS.gray, marginBottom: 4 }}>{value > 0 ? `${value}kg` : ''}</Text>
      <View style={{ height: 120, justifyContent: 'flex-end' }}>
        <Animated.View style={{ height: anim, width: 28, backgroundColor: color, borderRadius: 6, minHeight: value > 0 ? 4 : 0 }} />
      </View>
      <Text style={{ fontSize: 10, color: COLORS.gray, marginTop: 4, textAlign: 'center' }} numberOfLines={2}>{label}</Text>
    </View>
  );
}

export default function WeightChartScreen() {
  const params = useLocalSearchParams();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newNote, setNewNote] = useState('');
  const [period, setPeriod] = useState<'week' | 'month' | '3months' | 'all'>('month');

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) fetchLogs(selectedPet.id);
  }, [selectedPet, period]);

  const fetchPets = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pets`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) {
        const data = await res.json();
        const petList = data.pets || [];
        setPets(petList);
        if (petList.length > 0) setSelectedPet(petList[0]);
      }
    } catch (e) {
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (petId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/weight-logs/pet/${petId}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      setLogs([]);
    }
  };

  const addWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      Alert.alert('Erro', 'Insere um peso válido em kg');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/weight-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ petId: selectedPet.id, weight: parseFloat(newWeight), note: newNote }),
      });
      if (res.ok) {
        Alert.alert('✅', 'Peso registado!');
        setShowAddModal(false);
        setNewWeight('');
        setNewNote('');
        fetchLogs(selectedPet.id);
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível guardar');
    }
  };

  const filteredLogs = (() => {
    const now = new Date();
    const days = period === 'week' ? 7 : period === 'month' ? 30 : period === '3months' ? 90 : 9999;
    return logs.filter(l => {
      const d = new Date(l.recordedAt || l.createdAt || 0);
      return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= days;
    });
  })();

  const maxWeight = Math.max(...filteredLogs.map(l => l.weight), 0) * 1.2 || 10;
  const minWeight = Math.min(...filteredLogs.map(l => l.weight), 9999);
  const latestWeight = filteredLogs[filteredLogs.length - 1]?.weight;
  const firstWeight = filteredLogs[0]?.weight;
  const diff = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(2) : null;

  const chartLogs = filteredLogs.slice(-8);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚖️ Peso</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.orange} /></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          {/* Pet selector */}
          {pets.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }} contentContainerStyle={{ gap: 10 }}>
              {pets.map(p => (
                <TouchableOpacity key={p.id} onPress={() => setSelectedPet(p)} style={[styles.petChip, selectedPet?.id === p.id && styles.petChipActive]}>
                  <Text style={[styles.petChipTxt, selectedPet?.id === p.id && { color: '#fff' }]}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {selectedPet && (
            <>
              {/* Stats cards */}
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { borderTopColor: COLORS.orange }]}>
                  <Text style={styles.statLabel}>Atual</Text>
                  <Text style={styles.statValue}>{latestWeight ? `${latestWeight}kg` : '—'}</Text>
                </View>
                <View style={[styles.statCard, { borderTopColor: COLORS.teal }]}>
                  <Text style={styles.statLabel}>Mínimo</Text>
                  <Text style={styles.statValue}>{filteredLogs.length > 0 ? `${Math.min(...filteredLogs.map(l => l.weight))}kg` : '—'}</Text>
                </View>
                <View style={[styles.statCard, { borderTopColor: diff && parseFloat(diff) < 0 ? COLORS.green : COLORS.red }]}>
                  <Text style={styles.statLabel}>Variação</Text>
                  <Text style={[styles.statValue, { color: diff && parseFloat(diff) < 0 ? COLORS.green : COLORS.red }]}>
                    {diff ? `${parseFloat(diff) > 0 ? '+' : ''}${diff}kg` : '—'}
                  </Text>
                </View>
              </View>

              {/* Period filter */}
              <View style={styles.periodRow}>
                {(['week', 'month', '3months', 'all'] as const).map(p => (
                  <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={[styles.periodBtn, period === p && styles.periodBtnActive]}>
                    <Text style={[styles.periodTxt, period === p && styles.periodTxtActive]}>
                      {p === 'week' ? '7d' : p === 'month' ? '1m' : p === '3months' ? '3m' : 'Tudo'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Chart */}
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Evolução do Peso</Text>
                {chartLogs.length === 0 ? (
                  <View style={{ alignItems: 'center', padding: 30 }}>
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>⚖️</Text>
                    <Text style={{ color: COLORS.gray, fontSize: 14 }}>Nenhum registo ainda</Text>
                    <Text style={{ color: COLORS.gray, fontSize: 12, marginTop: 4 }}>Clica no + para adicionar o primeiro peso</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingTop: 8 }}>
                    {chartLogs.map((log, i) => {
                      const date = new Date(log.recordedAt || log.createdAt || 0);
                      const label = `${date.getDate()}/${date.getMonth() + 1}`;
                      const isLatest = i === chartLogs.length - 1;
                      return (
                        <AnimatedBar
                          key={log.id || i}
                          value={log.weight}
                          maxValue={maxWeight}
                          color={isLatest ? COLORS.orange : COLORS.purple + '88'}
                          label={label}
                          delay={i * 80}
                        />
                      );
                    })}
                  </View>
                )}
              </View>

              {/* History list */}
              <Text style={styles.sectionTitle}>Histórico</Text>
              {filteredLogs.length === 0 ? (
                <View style={styles.emptySmall}><Text style={styles.emptySmallTxt}>Sem registos neste período</Text></View>
              ) : (
                [...filteredLogs].reverse().map((log, i) => {
                  const prev = filteredLogs[filteredLogs.length - 2 - i];
                  const change = prev ? log.weight - prev.weight : null;
                  const date = new Date(log.recordedAt || log.createdAt || 0);
                  return (
                    <View key={log.id || i} style={styles.logItem}>
                      <View style={styles.logLeft}>
                        <Text style={styles.logWeight}>{log.weight} kg</Text>
                        {log.note && <Text style={styles.logNote}>{log.note}</Text>}
                      </View>
                      <View style={styles.logRight}>
                        <Text style={styles.logDate}>{date.toLocaleDateString('pt-PT')}</Text>
                        {change !== null && (
                          <Text style={[styles.logChange, { color: change < 0 ? COLORS.green : change > 0 ? COLORS.red : COLORS.gray }]}>
                            {change > 0 ? '▲' : change < 0 ? '▼' : '─'} {Math.abs(change).toFixed(2)}kg
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </>
          )}

          {pets.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🐾</Text>
              <Text style={styles.emptyText}>Sem animais registados</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/add-pet')}>
                <Text style={styles.emptyBtnTxt}>Adicionar Animal</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Add weight modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="formSheet" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registar Peso</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}><Ionicons name="close" size={22} color={COLORS.dark} /></TouchableOpacity>
            </View>
            <Text style={styles.modalPetName}>{selectedPet?.name}</Text>
            <Text style={styles.fieldLabel}>Peso (kg)</Text>
            <TextInput
              style={styles.input}
              value={newWeight}
              onChangeText={setNewWeight}
              placeholder="ex: 12.5"
              keyboardType="decimal-pad"
              autoFocus
            />
            <Text style={styles.fieldLabel}>Nota (opcional)</Text>
            <TextInput
              style={[styles.input, { height: 70 }]}
              value={newNote}
              onChangeText={setNewNote}
              placeholder="ex: Após consulta veterinária"
              multiline
            />
            <TouchableOpacity style={styles.saveBtn} onPress={addWeight}>
              <Text style={styles.saveTxt}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0EDF8' },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: COLORS.dark },
  addBtn: { backgroundColor: COLORS.orange, borderRadius: 20, padding: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  petChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.lightGray },
  petChipActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  petChipTxt: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center', borderTopWidth: 3, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 },
  statLabel: { fontSize: 11, color: COLORS.gray, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase' },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.dark },
  periodRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 4, gap: 4 },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  periodBtnActive: { backgroundColor: COLORS.orange },
  periodTxt: { fontSize: 13, fontWeight: '600', color: COLORS.gray },
  periodTxtActive: { color: '#fff' },
  chartCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6 },
  chartTitle: { fontSize: 15, fontWeight: '700', color: COLORS.dark, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dark },
  logItem: { backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 },
  logLeft: {},
  logWeight: { fontSize: 20, fontWeight: '800', color: COLORS.dark },
  logNote: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  logRight: { alignItems: 'flex-end' },
  logDate: { fontSize: 12, color: COLORS.gray },
  logChange: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  emptySmall: { alignItems: 'center', padding: 20 },
  emptySmallTxt: { color: COLORS.gray, fontSize: 14 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: COLORS.dark, marginBottom: 16 },
  emptyBtn: { backgroundColor: COLORS.orange, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnTxt: { color: '#fff', fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, gap: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark },
  modalPetName: { fontSize: 14, color: COLORS.purple, fontWeight: '600' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.dark },
  input: { borderWidth: 1, borderColor: '#E0D8F8', borderRadius: 10, padding: 12, fontSize: 16, color: COLORS.dark, backgroundColor: COLORS.bg },
  saveBtn: { backgroundColor: COLORS.orange, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 4 },
  saveTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
