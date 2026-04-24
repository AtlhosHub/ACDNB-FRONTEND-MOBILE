import { useState } from "react";
import { Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { gerarPlano } from "../services/api";

const LEVEL_LABEL = {
  Beginner:     "Iniciante",
  Intermediate: "Intermediário",
  Advanced:     "Avançado",
};


function buildPdfHtml(planText, students, date) {
  const studentRows = students.map((s) => {
    const obs = s.observacoes?.length > 0
      ? s.observacoes.join("; ")
      : "Sem observações";

    return `<tr>
      <td>${s.nome}</td>
      <td>${LEVEL_LABEL[s.nivel] ?? s.nivel}</td>
      <td>${obs}</td>
    </tr>`;
  }).join("");

  const planHtml = planText
    .split("\n")
    .filter((l) => l.trim())
    .map((line) => `<p>${line}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; padding: 36px; color: #1a1a1a; }
    h1   { color: #1652A1; font-size: 22px; border-bottom: 2px solid #1652A1; padding-bottom: 8px; margin-bottom: 4px; }
    h2   { color: #1652A1; font-size: 15px; margin: 24px 0 8px; }
    .meta { font-size: 12px; color: #777; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th   { background: #1652A1; color: #fff; padding: 8px 12px; text-align: left; font-size: 12px; }
    td   { padding: 8px 12px; border-bottom: 1px solid #e8e8e8; font-size: 12px; vertical-align: top; }
    tr:nth-child(even) td { background: #f4f8fd; }
    .plan-box { background: #f4f8fd; border-left: 4px solid #1652A1; padding: 16px 20px; border-radius: 0 6px 6px 0; }
    .plan-box p { margin: 5px 0; font-size: 13px; line-height: 1.7; }
    .footer { margin-top: 48px; font-size: 11px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 12px; }
  </style>
</head>
<body>
  <h1>SMASH — Plano de Treino</h1>
  <div class="meta">Gerado em ${date}</div>
  <h2>Alunos incluídos</h2>
  <table>
    <thead><tr><th>Nome</th><th>Nível</th><th>Observações</th></tr></thead>
    <tbody>${studentRows}</tbody>
  </table>
  <h2>Plano de treino</h2>
  <div class="plan-box">${planHtml}</div>
  <div class="footer">Gerado pelo Treinador AI — SMASH Tênis de Mesa</div>
</body>
</html>`;
}


export function useTrainingPlan() {
  const [isLoading, setIsLoading] = useState(false);

  const generatePlan = async (userMessage, students) => {
    setIsLoading(true);

    try {
      const planContent = await gerarPlano(userMessage, students);
      const hasStudents = students.length > 0;

      return {
        id:          Date.now().toString(),
        role:        "bot",
        text:        hasStudents
                       ? "Plano de treino gerado! Toque em Salvar PDF para baixar."
                       : planContent,
        time:        new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isPlan:      hasStudents,
        planContent: hasStudents ? planContent : undefined,
      };
    } catch (err) {
      console.error("generatePlan error:", err);
      return {
        id:   Date.now().toString(),
        role: "bot",
        text: `Erro: ${err?.message ?? "Falha ao conectar com o servidor."}`,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
    } finally {
      setIsLoading(false);
    }
  };


  const savePdf = async (planText, students) => {
    try {
      const date =
        new Date().toLocaleDateString("pt-BR") +
        " às " +
        new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      const html    = buildPdfHtml(planText, students, date);
      const { uri } = await Print.printToFileAsync({ html });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Não suportado", "Compartilhamento não disponível neste dispositivo.");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType:    "application/pdf",
        dialogTitle: "Salvar plano de treino",
        UTI:         "com.adobe.pdf",
      });
    } catch (err) {
      console.error("savePdf error:", err);
      Alert.alert("Erro", `Não foi possível gerar o PDF: ${err?.message ?? err}`);
    }
  };

  return { isLoading, generatePlan, savePdf };
}