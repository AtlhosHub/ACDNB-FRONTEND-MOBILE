// ─────────────────────────────────────────────────────────────────────────────
// TrainerAIScreen.js — Tela principal: orquestra componentes e hooks
//
// Responsabilidade deste arquivo: apenas gerenciar estado de UI e conectar
// os hooks (áudio, plano) com os componentes (chat, input, modal, pills).
//
// Estrutura de arquivos da feature:
//
//   trainer-ai/
//   ├── TrainerAIScreen.js             ← você está aqui
//   └── src/
//       ├── data/
//       │   ├── types.js               — JSDoc dos tipos (Student, Message)
//       │   ├── constants.js           — chaves de API, cores, labels
//       │   └── mockStudents.js        — dados mockados
//       ├── hooks/
//       │   ├── useAudioRecorder.js    — gravação + transcrição Gemini
//       │   └── useTrainingPlan.js     — geração de plano (Claude) + PDF
//       └── components/
//           ├── StudentModal.js        — modal de seleção de alunos
//           ├── ContextPills.js        — pills dos alunos selecionados
//           ├── MessageList.js         — lista de mensagens do chat
//           └── ChatInput.js           — input + botões mic/enviar
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import { MOCK_STUDENTS }    from "./src/data/mockStudents";
import { BRAND_BLUE }       from "./src/data/constants";

import { useAudioRecorder } from "./src/hooks/useAudioRecorder";
import { useTrainingPlan }  from "./src/hooks/useTrainingPlan";

import { StudentModal }  from "./components/StudentModal";
import { ContextPills }  from "./components/ContextPills";
import { MessageList }   from "./components/MessageList";
import { ChatInput }     from "./components/ChatInput";

// ── Mensagem de boas-vindas ────────────────────────────────────────────────────

const WELCOME_MESSAGE = {
  id:   "welcome",
  role: "bot",
  text: "Olá! Selecione os alunos na barra acima e me conte o que deseja trabalhar. Você pode digitar ou gravar um áudio.",
  time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
};

// ── Componente ────────────────────────────────────────────────────────────────

export default function TrainerAIScreen() {
  // Estado de UI
  const [messages,     setMessages]     = useState([WELCOME_MESSAGE]);
  const [input,        setInput]        = useState("");
  const [modalOpen,    setModalOpen]    = useState(false);
  const [selectedIds,  setSelectedIds]  = useState(new Set());

  // Hooks de lógica
  const audio = useAudioRecorder();
  const plan  = useTrainingPlan();

  // ── Seleção de alunos ────────────────────────────────────────────────────────
  const toggleStudent = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedStudents = MOCK_STUDENTS.filter((s) => selectedIds.has(s.id));

  // ── Envio de mensagem ────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text || plan.isLoading) return;

    // Adiciona mensagem do usuário imediatamente
    const userMsg = {
      id:   Date.now().toString(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Gera resposta da IA
    const botMsg = await plan.generatePlan(text, selectedStudents);
    if (botMsg) {
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  // ── Microfone: grava ou para e preenche o input ──────────────────────────────
  const handleMic = async () => {
    if (audio.isRecording) {
      const transcription = await audio.stopRecording();
      if (transcription) setInput(transcription);
    } else {
      await audio.startRecording();
    }
  };

  // ── Salvar PDF ───────────────────────────────────────────────────────────────
  const handleSavePdf = (planContent) => {
    plan.savePdf(planContent, selectedStudents);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BRAND_BLUE} barStyle="light-content" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>AI</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Treinador AI</Text>
            <Text style={styles.headerSub}>● Pronto para ajudar</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.alunosBtn, selectedIds.size > 0 && styles.alunosBtnActive]}
          onPress={() => setModalOpen(true)}
        >
          <Text style={styles.alunosBtnText}>
            Alunos{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pills dos alunos selecionados */}
      <ContextPills students={selectedStudents} onRemove={toggleStudent} />

      {/* Área do chat com teclado */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <MessageList
          messages={messages}
          isLoading={plan.isLoading}
          onSavePdf={handleSavePdf}
        />

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onMicPress={handleMic}
          isRecording={audio.isRecording}
          isTranscribing={audio.isTranscribing}
          isSending={plan.isLoading}
        />
      </KeyboardAvoidingView>

      {/* Modal de seleção de alunos */}
      <StudentModal
        visible={modalOpen}
        students={MOCK_STUDENTS}
        selected={selectedIds}
        onToggle={toggleStudent}
        onClose={() => setModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f6fa" },
  flex: { flex: 1 },

  header:        { backgroundColor: BRAND_BLUE, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  headerLeft:    { flexDirection: "row", alignItems: "center", gap: 10 },
  botAvatar:     { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  botAvatarText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  headerTitle:   { color: "#fff", fontWeight: "600", fontSize: 15 },
  headerSub:     { color: "#a8d4f5", fontSize: 11, marginTop: 1 },

  alunosBtn:       { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  alunosBtnActive: { backgroundColor: "rgba(255,255,255,0.28)", borderColor: "rgba(255,255,255,0.6)" },
  alunosBtnText:   { color: "#fff", fontSize: 13, fontWeight: "500" },
});