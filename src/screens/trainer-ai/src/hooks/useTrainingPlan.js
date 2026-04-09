// ─────────────────────────────────────────────────────────────────────────────
// useTrainingPlan.js — Hook para geração de plano via Claude e exportação PDF
//
// Responsabilidades:
//   generatePlan()  →  monta prompt com contexto dos alunos, chama Claude
//   savePdf()       →  gera HTML formatado, imprime em PDF, salva na galeria
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { GEMINI_API_KEY, LEVEL_LABEL } from "../data/constants";

// ── Helpers de prompt ─────────────────────────────────────────────────────────

function buildPrompt(userMessage, students) {
  if (students.length === 0) {
    return `Você é um assistente especialista em treino de tênis de mesa.
Solicitação do treinador: "${userMessage}".
Responda em português de forma prática e objetiva.`;
  }

  const profiles = students
    .map((s) => `- ${s.name} (${LEVEL_LABEL[s.level]}): ${s.obs}`)
    .join("\n");

  return `Você é um assistente especialista em treino de tênis de mesa.

Alunos selecionados e seus perfis:
${profiles}

Solicitação do treinador: "${userMessage}"

Gere um plano de treino detalhado e personalizado para esses alunos em português.
Seja prático, objetivo e organize por seções (aquecimento, exercícios principais, volta à calma).`;
}

// ── HTML do PDF ───────────────────────────────────────────────────────────────

function buildPdfHtml(planText, students, date) {
  const studentRows = students
    .map(
      (s) => `<tr>
        <td>${s.name}</td>
        <td>${LEVEL_LABEL[s.level]}</td>
        <td>${s.obs}</td>
      </tr>`
    )
    .join("");

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
    td   { padding: 8px 12px; border-bottom: 1px solid #e8e8e8; font-size: 12px; }
    tr:nth-child(even) td { background: #f4f8fd; }
    .plan-box { background: #f4f8fd; border-left: 4px solid #1652A1; padding: 16px 20px; border-radius: 0 6px 6px 0; margin-top: 4px; }
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

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTrainingPlan() {
  const [isLoading, setIsLoading] = useState(false);

  // ── Chama Claude e retorna a mensagem pronta ────────────────────────────────
  const generatePlan = async (userMessage, students) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(userMessage, students) }] }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data?.error?.message ?? `HTTP ${response.status}`;
        console.error("Gemini API error:", JSON.stringify(data));
        throw new Error(errMsg);
      }

      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!replyText) {
        console.error("Resposta inesperada da API:", JSON.stringify(data));
        throw new Error("Resposta vazia da API.");
      }

      const hasStudents = students.length > 0;

      return {
        id:          Date.now().toString(),
        role:        "bot",
        text:        hasStudents
                       ? "Plano de treino gerado! Toque em Salvar PDF para baixar."
                       : replyText,
        time:        new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isPlan:      hasStudents,
        planContent: hasStudents ? replyText : undefined,
      };
    } catch (err) {
      console.error("generatePlan catch:", err);
      return {
        id:   Date.now().toString(),
        role: "bot",
        text: `Erro: ${err?.message ?? "Falha ao conectar com a IA."}`,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Gera e compartilha o PDF ──────────────────────────────────────────────
  const savePdf = async (planText, students) => {
    try {
      const date =
        new Date().toLocaleDateString("pt-BR") +
        " às " +
        new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      const html     = buildPdfHtml(planText, students, date);
      const { uri }  = await Print.printToFileAsync({ html });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Não suportado", "Compartilhamento não está disponível neste dispositivo.");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Salvar plano de treino",
        UTI: "com.adobe.pdf",
      });
    } catch (err) {
      console.error("savePdf error:", err);
      Alert.alert("Erro", `Não foi possível gerar o PDF: ${err?.message ?? err}`);
    }
  };

  return { isLoading, generatePlan, savePdf };
}