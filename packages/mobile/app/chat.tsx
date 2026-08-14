import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
  Image, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { authClient } from '../lib/auth';
import { authFetch } from "../lib/auth-fetch";

const TOKEN_KEY = "bearer_token";
function getToken(): string {
  if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null) ?? "";
  try { const SecureStore = require("expo-secure-store"); return SecureStore.getItem(TOKEN_KEY) ?? ""; } catch { return ""; }
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://petslife.onrender.com';
const COLORS = { bg: '#F8F6FF', orange: '#FF6B35', teal: '#4ECDC4', purple: '#8B5CF6', dark: '#1A1A2E', text: '#333', gray: '#888', lightGray: '#E8E4F8', card: '#FFFFFF' };

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const { chatId, otherUserName, otherUserId } = params as any;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const { data: sessionData } = authClient.useSession();
  const userId = sessionData?.user?.id || '';

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      pollRef.current = setInterval(fetchMessages, 4000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const res = await authFetch(`${API_URL}/api/chats/${chatId}/messages`, {
        headers: { 'x-user-id': userId || '' },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {}
    finally { setLoading(false); }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput('');
    setSending(true);

    // Optimistic update
    const optimistic = { id: `opt_${Date.now()}`, senderId: userId, content, createdAt: new Date().toISOString(), senderName: 'Eu' };
    setMessages(prev => [...prev, optimistic]);

    try {
      const res = await authFetch(`${API_URL}/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId || '' },
        body: JSON.stringify({ senderId: userId, content }),
      });
      if (!res.ok) {
        // Remove optimistic
        setMessages(prev => prev.filter(m => m.id !== optimistic.id));
        Alert.alert('Erro', 'Não foi possível enviar a mensagem');
      }
    } catch (e) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    } finally {
      setSending(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isMine = item.senderId === userId;
    const time = new Date(item.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    const showSenderName = !isMine && (index === 0 || messages[index - 1]?.senderId !== item.senderId);

    return (
      <View style={[styles.msgRow, isMine ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isMine && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(item.senderName || otherUserName || '?')[0].toUpperCase()}</Text>
          </View>
        )}
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
          {showSenderName && !isMine && (
            <Text style={styles.senderName}>{item.senderName || otherUserName || 'Utilizador'}</Text>
          )}
          <Text style={[styles.msgText, isMine && styles.msgTextMine]}>{item.content}</Text>
          <Text style={[styles.msgTime, isMine && styles.msgTimeMine]}>{time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.dark} />
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarTxt}>{(otherUserName || '?')[0]?.toUpperCase()}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{otherUserName || 'Chat'}</Text>
          <Text style={styles.headerStatus}>● Online</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        {loading ? (
          <View style={styles.center}><ActivityIndicator size="large" color={COLORS.orange} /></View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, i) => item.id || String(i)}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 16, gap: 4 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatIcon}>💬</Text>
                <Text style={styles.emptyChatText}>Ainda sem mensagens</Text>
                <Text style={styles.emptyChatSub}>Envia a primeira mensagem!</Text>
              </View>
            }
          />
        )}

        {/* Input */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Escreve uma mensagem..."
            placeholderTextColor={COLORS.gray}
            multiline
            maxLength={1000}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0EDF8', gap: 10 },
  backBtn: { padding: 4 },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.purple, alignItems: 'center', justifyContent: 'center' },
  headerAvatarTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700', color: COLORS.dark },
  headerStatus: { fontSize: 11, color: COLORS.teal, fontWeight: '600' },
  headerAction: { padding: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  msgRow: { flexDirection: 'row', marginVertical: 2, maxWidth: '85%' },
  msgRowLeft: { alignSelf: 'flex-start', gap: 8 },
  msgRowRight: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.lightGray, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
  avatarText: { fontSize: 12, fontWeight: '700', color: COLORS.purple },
  bubble: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, maxWidth: '100%' },
  bubbleMine: { backgroundColor: COLORS.orange, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: '#fff', borderBottomLeftRadius: 4, elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 },
  senderName: { fontSize: 11, fontWeight: '700', color: COLORS.purple, marginBottom: 3 },
  msgText: { fontSize: 14, color: COLORS.dark, lineHeight: 20 },
  msgTextMine: { color: '#fff' },
  msgTime: { fontSize: 10, color: COLORS.gray, textAlign: 'right', marginTop: 3 },
  msgTimeMine: { color: 'rgba(255,255,255,0.7)' },
  emptyChat: { alignItems: 'center', paddingVertical: 80 },
  emptyChatIcon: { fontSize: 48, marginBottom: 12 },
  emptyChatText: { fontSize: 16, fontWeight: '700', color: COLORS.dark },
  emptyChatSub: { fontSize: 13, color: COLORS.gray, marginTop: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F0EDF8', gap: 10 },
  input: { flex: 1, backgroundColor: COLORS.bg, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: COLORS.dark, maxHeight: 100, borderWidth: 1, borderColor: '#E0D8F8' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.orange, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: COLORS.lightGray },
});
