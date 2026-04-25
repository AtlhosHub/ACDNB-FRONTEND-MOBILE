import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BRAND_BLUE }       from "../mocks/constants";
import { getAlunos }        from "../services/api";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useTrainingPlan }  from "../hooks/useTrainingPlan";
import { StudentModal }     from "../components/StudentModal";
import { ContextPills }     from "../components/ContextPills";
import { MessageList }      from "../components/MessageList";
import { ChatInput }        from "../components/ChatInput";


const WELCOME_MESSAGE = {
  id:   "welcome",
  role: "bot",
  text: "Olá! Selecione os alunos na barra acima e me conte o que deseja trabalhar. Você pode digitar ou gravar um áudio.",
  time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
};


export default function TrainerAIScreen() {

  const [messages,    setMessages]    = useState([WELCOME_MESSAGE]);
  const [input,       setInput]       = useState("");
  const [modalOpen,   setModalOpen]   = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [alunos,        setAlunos]        = useState([]);
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [errorAlunos,   setErrorAlunos]   = useState(null);

  const audio = useAudioRecorder();
  const plan  = useTrainingPlan();

  useEffect(() => {
    getAlunos()
      .then(setAlunos)
      .catch((err) => {
        console.error("Erro ao buscar alunos:", err);
        setErrorAlunos("Não foi possível carregar os alunos.");
      })
      .finally(() => setLoadingAlunos(false));
  }, []);

  const toggleStudent = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedStudents = alunos.filter((s) => selectedIds.has(s.id));

  const handleSend = async () => {
    const text = input.trim();
    if (!text || plan.isLoading) return;

    const userMsg = {
      id:   Date.now().toString(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const botMsg = await plan.generatePlan(text, selectedStudents);
    if (botMsg) setMessages((prev) => [...prev, botMsg]);
  };


  const handleMic = async () => {
    if (audio.isRecording) {
      const planContent = await audio.stopRecording(selectedStudents);

      if (planContent) {
        const hasStudents = selectedStudents.length > 0;
        const botMsg = {
          id:          Date.now().toString(),
          role:        "bot",
          text:        hasStudents
                         ? "Plano de treino gerado! Toque em Salvar PDF para baixar."
                         : planContent,
          time:        new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          isPlan:      hasStudents,
          planContent: hasStudents ? planContent : undefined,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } else {
      await audio.startRecording();
    }
  };

  const handleMicDiscard = async () => {
    await audio.cancelRecording();
  };

  const handleSavePdf = (planContent) => {
    plan.savePdf(planContent, selectedStudents);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>

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
          disabled={loadingAlunos}
        >
          {loadingAlunos ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.alunosBtnText}>
              Alunos{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Erro ao carregar alunos */}
      {errorAlunos && (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>{errorAlunos}</Text>
        </View>
      )}

      {/* Pills dos alunos selecionados */}
      <ContextPills students={selectedStudents} onRemove={toggleStudent} />

      {/* Chat */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <MessageList
          messages={messages}
          isLoading={plan.isLoading || audio.isTranscribing}
          onSavePdf={handleSavePdf}
        />

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onMicPress={handleMic}
          onMicDiscard={handleMicDiscard}
          isRecording={audio.isRecording}
          isTranscribing={audio.isTranscribing}
          isSending={plan.isLoading}
        />
      </KeyboardAvoidingView>

      {/* Modal de seleção */}
      <StudentModal
        visible={modalOpen}
        students={alunos}        // lista real do backend
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

  alunosBtn:       { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", minWidth: 80, alignItems: "center" },
  alunosBtnActive: { backgroundColor: "rgba(255,255,255,0.28)", borderColor: "rgba(255,255,255,0.6)" },
  alunosBtnText:   { color: "#fff", fontSize: 13, fontWeight: "500" },

  errorBar:  { backgroundColor: "#FCEBEB", padding: 10, alignItems: "center" },
  errorText: { color: "#A32D2D", fontSize: 12 },
});