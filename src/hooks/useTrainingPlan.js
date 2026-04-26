import { useState } from "react";
import { Alert, Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { gerarPlano } from "../services/api";


function markdownToHtml(text) {
  return text
    .replace(/```[\s\S]*?```/g, "")

    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm,  "<h2>$1</h2>")
    .replace(/^# (.+)$/gm,   "<h1>$1</h1>")

    // Negrito **texto** ou __texto__
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g,     "<strong>$1</strong>")

    // Itálico *texto* ou _texto_ (cuidado para não pegar **)
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g,       "<em>$1</em>")

    // Separador ---
    .replace(/^---+$/gm, "<hr/>")

    // Itens de lista * item ou - item
    .replace(/^[\*\-] (.+)$/gm, "<li>$1</li>")

    // Agrupa <li> soltos em <ul>
    .replace(/(<li>[\s\S]+?<\/li>)(\n(?!<li>)|$)/g, "<ul>$1</ul>")

    // Linhas normais viram <p> (ignora linhas que já são tags HTML)
    .split("\n")
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|ul|li|hr|strong|em)/.test(trimmed)) return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}


function gerarNomeArquivo() {
  const now  = new Date();
  const dd   = String(now.getDate()).padStart(2, "0");
  const mm   = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh   = String(now.getHours()).padStart(2, "0");
  const min  = String(now.getMinutes()).padStart(2, "0");
  return `Plano_Treino_${dd}-${mm}-${yyyy}_${hh}-${min}.pdf`;
}


function buildPdfHtml(planText, students, date) {
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

  const planHtml = markdownToHtml(planText);

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

      const html      = buildPdfHtml(planText, students, date);
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