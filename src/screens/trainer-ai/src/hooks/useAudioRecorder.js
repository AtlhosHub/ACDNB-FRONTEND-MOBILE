// ─────────────────────────────────────────────────────────────────────────────
// useAudioRecorder.js — Hook de gravação de áudio + transcrição via Gemini
//
// Fluxo:
//   startRecording()  →  grava áudio nativo com expo-av
//   stopRecording()   →  para, lê base64, envia ao Gemini, retorna transcrição
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from "react";
import { Alert } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { GEMINI_API_KEY } from "../data/constants";

// Mapa de extensão → mime type para compatibilidade com diferentes Androids
const MIME_MAP = {
  m4a: "audio/m4a",
  aac: "audio/aac",
  "3gp": "audio/3gpp",
  mp4: "audio/mp4",
  wav: "audio/wav",
};

export function useAudioRecorder() {
  const [isRecording, setIsRecording]       = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recordingRef = useRef(null);

  // ── Inicia gravação ─────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permissão negada", "Permita o acesso ao microfone nas configurações.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
    } catch {
      Alert.alert("Erro", "Não foi possível iniciar a gravação.");
    }
  };

  // ── Para gravação e transcreve via Gemini ───────────────────────────────────
  const stopRecording = async () => {
    if (!recordingRef.current) return "";

    setIsRecording(false);
    setIsTranscribing(true);

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI() ?? "";
      recordingRef.current = null;

      const ext      = uri.split(".").pop()?.toLowerCase() ?? "m4a";
      const mimeType = MIME_MAP[ext] ?? "audio/m4a";

      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { inline_data: { mime_type: mimeType, data: base64Audio } },
                  {
                    text: "Transcreva exatamente o que foi dito neste áudio em português. Retorne apenas a transcrição, sem explicações adicionais.",
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data?.error?.message ?? `HTTP ${response.status}`;
        console.error("Gemini API error:", JSON.stringify(data));
        throw new Error(errMsg);
      }

      const transcription = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      console.log("Transcrição recebida:", transcription);
      return transcription;
    } catch (err) {
      console.error("stopRecording catch:", err);
      Alert.alert("Erro na transcrição", err?.message ?? "Falha ao transcrever. Tente novamente.");
      return "";
    } finally {
      setIsTranscribing(false);
    }
  };

  return { isRecording, isTranscribing, startRecording, stopRecording };
}