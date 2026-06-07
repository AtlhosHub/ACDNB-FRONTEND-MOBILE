import { useState } from "react";
import { Alert, Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { gerarPlano } from "../services/api";
import { gerarNomeArquivo, markdownToHtml, isPlanRequest, resolveImageDataUri } from "../utils/formatters";

const EXERCISE_DEFINITIONS = {
  forehand:  { labels: ["forehand", "fh"], title: "Forehand", img: require('../assets/images/forehand.png') },
  backhand:  { labels: ["backhand", "bh"], title: "Backhand", img: require('../assets/images/backhand.png') },
  topspin:   { labels: ["topspin"], title: "Topspin", img: require('../assets/images/topspin.png') },
  bloqueio:  { labels: ["bloqueio", "block"], title: "Bloqueio", img: require('../assets/images/bloqueio.png') },
  saque:     { labels: ["saque", "serve"], title: "Saque", img: require('../assets/images/saque.png') },
};

function detectExercises(text) {
  const found = new Set();
  if (!text) return [];
  const lower = text.toLowerCase();

  Object.entries(EXERCISE_DEFINITIONS).forEach(([key, def]) => {
    def.labels.forEach((lbl) => {
      const safe = lbl.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const re = new RegExp("\\b" + safe + "\\b", "i");
      if (re.test(lower)) found.add(key);
    });
  });

  return Array.from(found);
}

async function buildExercisesHtml(keys) {
  if (!keys || keys.length === 0) return "";

  const cards = await Promise.all(
    keys.map(async (k) => {
      const title = EXERCISE_DEFINITIONS[k]?.title ?? k;
      const imageModule = EXERCISE_DEFINITIONS[k]?.img;
      const imageSrc = imageModule ? await resolveImageDataUri(imageModule) : null;

      return `
        <div style="border:1px solid #dfe9fb;border-radius:12px;padding:16px;text-align:center;width:170px;flex-shrink:0;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.05);">
          <div style="height:120px;background:#f4f8fd;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;overflow:hidden;">
            ${imageSrc ? `<img src="${imageSrc}" alt="${title}" style="max-width:100%;max-height:100%;object-fit:contain;"/>` : "<span style=\"color:#6b7a99;font-size:12px;\">sem imagem</span>"}
          </div>
          <div style="font-size:13px;font-weight:700;color:#1652A1;">${title}</div>
        </div>`;
    })
  );

  return `<h2>Técnicas referenciadas neste plano</h2><div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;">${cards.join('')}</div>`;
}


async function buildPdfHtml(planText, students, date) {
  const NIVEL_LABEL = {
    Iniciante:     "Iniciante",
    Intermediário: "Intermediário",
    Avançado:      "Avançado",
    Profissional:  "Profissional",
  };

  const studentRows = students.map((s) => {
    const obs = Array.isArray(s.observacoes) && s.observacoes.length > 0
      ? s.observacoes.join("; ")
      : "Sem observações";

    return `<tr>
      <td>${s.nome ?? s.name ?? ""}</td>
      <td>${NIVEL_LABEL[s.nivel] ?? s.nivel ?? "—"}</td>
      <td>${obs}</td>
    </tr>`;
  }).join("");

  const studentSection = students.length > 0 ? `
    <h2>Alunos incluídos</h2>
    <table>
      <thead><tr><th>Nome</th><th>Nível</th><th>Observações</th></tr></thead>
      <tbody>${studentRows}</tbody>
    </table>
  ` : "";

  const exerciseKeys   = detectExercises(planText);
  const exercisesHtml  = await buildExercisesHtml(exerciseKeys);
  const planHtml       = markdownToHtml(planText);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <style>
    body     { font-family: Arial, sans-serif; padding: 36px; color: #1a1a1a; font-size: 13px; line-height: 1.6; }
    h1       { color: #1652A1; font-size: 22px; border-bottom: 2px solid #1652A1; padding-bottom: 8px; margin-bottom: 4px; }
    h2       { color: #1652A1; font-size: 16px; margin: 24px 0 8px; }
    h3       { color: #1652A1; font-size: 14px; margin: 16px 0 6px; }
    hr       { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
    p        { margin: 5px 0; }
    ul       { margin: 6px 0 6px 20px; padding: 0; }
    li       { margin: 3px 0; }
    strong   { font-weight: 600; }
    em       { font-style: italic; }
    .meta    { font-size: 12px; color: #777; margin-bottom: 24px; }
    table    { width: 100%; border-collapse: collapse; margin-top: 4px; }
    th       { background: #1652A1; color: #fff; padding: 8px 12px; text-align: left; font-size: 12px; }
    td       { padding: 8px 12px; border-bottom: 1px solid #e8e8e8; font-size: 12px; vertical-align: top; }
    tr:nth-child(even) td { background: #f4f8fd; }
    .plan-box { background: #f4f8fd; border-left: 4px solid #1652A1; padding: 16px 20px; border-radius: 0 6px 6px 0; margin-top: 4px; }
    .footer  { margin-top: 48px; font-size: 11px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 12px; }
  </style>
</head>
<body>
  <h1>ACDNB — Plano de Treino</h1>
  <div class="meta">Gerado em ${date}</div>

  ${studentSection}

  ${exercisesHtml}

  <h2>Plano de treino</h2>
  <div class="plan-box">${planHtml}</div>

  <div class="footer">Gerado pelo Treinador AI — ACDNB Tênis de Mesa</div>
</body>
</html>`;
}


export function useTrainingPlan() {
  const [isLoading, setIsLoading] = useState(false);

  const generatePlan = async (userMessage, students) => {
    setIsLoading(true);

    try {
      const planContent = await gerarPlano(userMessage, students);
      const planRequest = isPlanRequest(userMessage);
      return {
        id:          Date.now().toString(),
        role:        "bot",
        text:        planRequest
                       ? "Plano de treino gerado! Toque em Salvar PDF para baixar."
                       : planContent,
        time:        new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isPlan:      planRequest,
        planContent: planRequest ? planContent : undefined,
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

      const html      = await buildPdfHtml(planText, students, date);
      const { uri }   = await Print.printToFileAsync({ html });
      const fileName  = gerarNomeArquivo();
      const namedUri  = FileSystem.cacheDirectory + fileName;

      await FileSystem.copyAsync({ from: uri, to: namedUri });

      if (Platform.OS === "web") {
        window.open(namedUri, "_blank");
        return;
      }

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Não suportado", "Compartilhamento não disponível neste dispositivo.");
        return;
      }

      await Sharing.shareAsync(namedUri, {
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

