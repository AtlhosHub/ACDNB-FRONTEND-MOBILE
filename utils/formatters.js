import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

export const formatDate = (text) => {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

// Formato de data ISO para DD/MM/YYYY
export const formatarData = (dataISO) => {
  if (!dataISO) return '-';
  try {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return '-';
  }
};

export const formatarHorario = (horarioInicio, horarioFim) => {
  if (!horarioInicio || !horarioFim) return '-';
  try {
    const inicio = horarioInicio.split(':')[0]; // Extrai hora de "14:00:00"
    const fim = horarioFim.split(':')[0]; // Extrai hora de "17:00:00"
    return `${inicio}H - ${fim}H`;
  } catch (e) {
    return '-';
  }
};

export const formatarCPF = (cpf) => {
  if (!cpf) return '';

  const cpfLimpo = cpf.replace(/\D/g, '');

  return cpfLimpo
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

export const formatDisplayDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatToApiDateTime = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}T10:00:00`;
};

export const formatToApiDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

export const gerarNomeArquivo = () => {
  const now  = new Date();
  const dd   = String(now.getDate()).padStart(2, '0');
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh   = String(now.getHours()).padStart(2, '0');
  const min  = String(now.getMinutes()).padStart(2, '0');
  return `Plano_Treino_${dd}-${mm}-${yyyy}_${hh}-${min}.pdf`;
};

export const markdownToHtml = (text) => {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#{1,6} (.+)$/gm, (match) => {
      const level = match.match(/^#+/)[0].length;
      return `<h${level}>${match.replace(/^#{1,6} /, "")}</h${level}>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g,     "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g,       "<em>$1</em>")
    .replace(/^---+$/gm, "<hr/>")
    .replace(/^\s*[\*\-•]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]+?<\/li>)(\n(?!<li>)|$)/g, "<ul>$1</ul>")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|ul|li|hr|strong|em)/.test(trimmed)) return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .filter(Boolean)
    .join("\n");
};

const PLAN_REQUEST_REGEX = /\b(plano|relat[oó]rio|pdf|treino|treinar|treinamento|ficha|exerc[ií]cio|programa|aula|sess[aã]o)\b/i;

export const isPlanRequest = (text) => {
  if (!text) return false;
  return PLAN_REQUEST_REGEX.test(text);
};

export const resolveImageDataUri = async (module) => {
  try {
    const asset = Asset.fromModule(module);
    await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    if (!uri) return null;

    const ext = uri.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'png';
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/${ext};base64,${base64}`;
  } catch (err) {
    console.error('resolveImageDataUri error:', err);
    return null;
  }
};