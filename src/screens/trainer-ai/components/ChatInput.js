// ─────────────────────────────────────────────────────────────────────────────
// ChatInput.js — Área de input com campo de texto, microfone e envio
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BRAND_BLUE } from "../src/data/constants";

export function ChatInput({
  value,
  onChange,
  onSend,
  onMicPress,
  isRecording,
  isTranscribing,
  isSending,
}) {
  const canSend = value.trim().length > 0 && !isSending;

  return (
    <View style={styles.wrapper}>

      {/* Barra de status — transcrevendo */}
      {isTranscribing && (
        <View style={styles.statusBar}>
          <ActivityIndicator size="small" color={BRAND_BLUE} />
          <Text style={styles.statusText}>Transcrevendo áudio com Gemini...</Text>
        </View>
      )}

      {/* Barra de status — gravando */}
      {isRecording && !isTranscribing && (
        <View style={styles.statusBar}>
          <View style={styles.recDot} />
          <Text style={[styles.statusText, styles.recText]}>Gravando... toque para parar</Text>
        </View>
      )}

      <View style={styles.row}>
        {/* Campo de texto */}
        <TextInput
          style={styles.input}
          placeholder="O que deseja mudar no treino?"
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSend}
          returnKeyType="send"
          multiline
          editable={!isTranscribing}
        />

        {/* Botão de microfone */}
        <TouchableOpacity
          style={[styles.iconBtn, isRecording && styles.iconBtnRecording]}
          onPress={onMicPress}
          disabled={isTranscribing}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={20}
            color={isRecording ? "#fff" : "#555"}
          />
        </TouchableOpacity>

        {/* Botão enviar */}
        <TouchableOpacity
          style={[styles.iconBtn, styles.iconBtnSend, !canSend && styles.iconBtnDisabled]}
          onPress={onSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },

  statusBar: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8, paddingHorizontal: 4 },
  statusText: { fontSize: 12, color: BRAND_BLUE },
  recDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: "#E24B4A" },
  recText:    { color: "#E24B4A" },

  row: { flexDirection: "row", alignItems: "flex-end", gap: 8 },

  input: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1a1a1a",
    maxHeight: 100,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },

  iconBtn:         { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: "#ddd", backgroundColor: "#f5f6fa", flexShrink: 0 },
  iconBtnRecording:{ backgroundColor: "#E24B4A", borderColor: "#E24B4A" },
  iconBtnSend:     { backgroundColor: BRAND_BLUE, borderColor: BRAND_BLUE },
  iconBtnDisabled: { opacity: 0.4 },
});