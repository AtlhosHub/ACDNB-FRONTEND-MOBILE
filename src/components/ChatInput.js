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
import { BRAND_BLUE } from "../mocks/constants";

export function ChatInput({
  value,
  onChange,
  onSend,
  onMicPress,
  onMicDiscard,
  isRecording,
  isTranscribing,
  isSending,
}) {
  const canSend = value.trim().length > 0 && !isSending;

  if (isRecording) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.recordingRow}>
          {/* Descartar */}
          <TouchableOpacity style={styles.discardBtn} onPress={onMicDiscard} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={22} color="#E24B4A" />
          </TouchableOpacity>

          {/* Indicador central */}
          <View style={styles.recordingIndicator}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>Gravando...</Text>
          </View>

          {/* Confirmar / enviar */}
          <TouchableOpacity style={styles.confirmBtn} onPress={onMicPress} activeOpacity={0.7}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>

      {/* Barra de status — transcrevendo */}
      {isTranscribing && (
        <View style={styles.statusBar}>
          <ActivityIndicator size="small" color={BRAND_BLUE} />
          <Text style={styles.statusText}>Analisando solicitação...</Text>
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
          style={styles.iconBtn}
          onPress={onMicPress}
          disabled={isTranscribing}
          activeOpacity={0.7}
        >
          <Ionicons name="mic" size={20} color="#555" />
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
  iconBtnSend:     { backgroundColor: BRAND_BLUE, borderColor: BRAND_BLUE },
  iconBtnDisabled: { opacity: 0.4 },

  // Gravação estilo WhatsApp
  recordingRow:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 },
  recordingIndicator:{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  discardBtn:        { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: "#fff0f0", borderWidth: 1, borderColor: "#E24B4A" },
  confirmBtn:        { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: "#22c55e" },
});