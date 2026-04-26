import { useRef, useState } from "react";
import { Alert } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { transcreverEGerarPlano } from "../services/api";

const MIME_MAP = {
  m4a: "audio/m4a",
  aac: "audio/aac",
  "3gp": "audio/3gpp",
  mp4: "audio/mp4",
  wav: "audio/wav",
};

export function useAudioRecorder() {
  const [isRecording,    setIsRecording]    = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recordingRef = useRef(null);

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
    } catch (err) {
      console.error("startRecording error:", err);
      Alert.alert("Erro", "Não foi possível iniciar a gravação.");
    }
  };


  const cancelRecording = async () => {
    if (!recordingRef.current) return;
    setIsRecording(false);
    try {
      await recordingRef.current.stopAndUnloadAsync();
    } catch (_) {}
    recordingRef.current = null;
  };

  const stopRecording = async (students = []) => {
    if (!recordingRef.current) return "";

    setIsRecording(false);
    setIsTranscribing(true);

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI() ?? "";
      recordingRef.current = null;

      const ext      = uri.split(".").pop()?.toLowerCase() ?? "m4a";
      const mimeType = MIME_MAP[ext] ?? "audio/m4a";

      const audioBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return await transcreverEGerarPlano(audioBase64, mimeType, students);
    } catch (err) {
      console.error("stopRecording error:", err);
      Alert.alert("Erro", err?.message ?? "Falha ao processar o áudio. Tente novamente.");
      return "";
    } finally {
      setIsTranscribing(false);
    }
  };

  return { isRecording, isTranscribing, startRecording, stopRecording, cancelRecording };
}