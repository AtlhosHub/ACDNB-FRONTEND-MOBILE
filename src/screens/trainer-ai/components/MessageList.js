// ─────────────────────────────────────────────────────────────────────────────
// MessageList.js — Lista de mensagens do chat
//
// Mensagens com isPlan=true mostram apenas um texto curto + botão de PDF.
// O conteúdo completo do plano fica em planContent, usado só para o PDF.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "../src/data/constants";

export function MessageList({ messages, isLoading, onSavePdf }) {
  const scrollRef = useRef(null);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
    >
      {messages.map((msg) => (
        <View
          key={msg.id}
          style={[styles.row, msg.role === "user" ? styles.rowUser : styles.rowBot]}
        >
          {msg.role === "bot" && (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AI</Text>
            </View>
          )}

          <View style={styles.msgContent}>
            <View style={[styles.bubble, msg.role === "user" ? styles.bubbleUser : styles.bubbleBot]}>
              <Text style={[styles.bubbleText, msg.role === "user" && styles.bubbleTextUser]}>
                {msg.text}
              </Text>
            </View>

            {/* Botão de PDF — só aparece em mensagens com plano gerado */}
            {msg.isPlan && msg.planContent && (
              <TouchableOpacity
                style={styles.pdfBtn}
                onPress={() => onSavePdf(msg.planContent)}
                activeOpacity={0.7}
              >
                <Text style={styles.pdfBtnText}>📄 Salvar Plano como PDF</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.time, msg.role === "user" && styles.timeUser]}>
              {msg.time}
            </Text>
          </View>
        </View>
      ))}

      {/* Indicador de carregamento */}
      {isLoading && (
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
          <View style={[styles.bubble, styles.bubbleBot, styles.loadingBubble]}>
            <ActivityIndicator size="small" color={BRAND_BLUE} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: "#f5f6fa" },
  content: { padding: 16, gap: 12 },

  row:     { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  rowBot:  {},
  rowUser: { flexDirection: "row-reverse" },

  avatar:     { width: 30, height: 30, borderRadius: 15, backgroundColor: BRAND_BLUE_LIGHT, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  avatarText: { color: BRAND_BLUE, fontSize: 10, fontWeight: "600" },

  msgContent: { flex: 1, gap: 4 },

  bubble:         { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, maxWidth: "85%" },
  bubbleBot:      { backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#e0e0e0", borderBottomLeftRadius: 4 },
  bubbleUser:     { backgroundColor: BRAND_BLUE, borderBottomRightRadius: 4, alignSelf: "flex-end" },
  loadingBubble:  { paddingVertical: 14 },
  bubbleText:     { fontSize: 14, color: "#1a1a1a", lineHeight: 20 },
  bubbleTextUser: { color: "#fff" },

  pdfBtn:     { alignSelf: "flex-start", marginTop: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 0.5, borderColor: BRAND_BLUE, backgroundColor: BRAND_BLUE_LIGHT },
  pdfBtnText: { fontSize: 12, color: BRAND_BLUE, fontWeight: "500" },

  time:     { fontSize: 10, color: "#bbb", marginLeft: 2 },
  timeUser: { textAlign: "right", marginRight: 2 },
});