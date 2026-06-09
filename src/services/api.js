import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = 'AuthToken';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(usuario, senha) {
  let response;
  try {
    response = await api.post('/usuarios/login', { email: usuario, senha });
  } catch (error) {
    if (error.response?.status === 401) throw new Error('Senha incorreta.');
    if (error.response?.status === 404) throw new Error('Usuário não encontrado.');
    if (error.response) throw new Error(`Erro ${error.response.status} - Tente novamente mais tarde.`);
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  const data = response.data;
  const token = data.token ?? data.accessToken ?? data.access_token;
  if (!token) throw new Error('Erro interno no servidor. Tente novamente mais tarde.');

  await AsyncStorage.setItem(TOKEN_KEY, token);
  return token;
}


export async function logout() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

function extractErrorMessage(error, fallbackMessage) {
  const response = error.response;
  if (!response) return fallbackMessage;

  const data = response.data;
  if (data?.message) return data.message;
  if (typeof data === 'string' && data.trim()) return data.trim();
  return fallbackMessage ?? `Erro ${response.status} - Tente novamente mais tarde.`;
}

export async function getAlunos() {
  const { data } = await api.get('/trainer/alunos');

  return data.map((a) => {
    const nome   = a.nome ?? a.name ?? "";
    const partes = nome.trim().split(/\s+/);
    const initials =
      partes.length >= 2
        ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
        : nome.slice(0, 2).toUpperCase();

    const NIVEL_MAP = {
      INICIANTE:     "Iniciante",
      INTERMEDIARIO: "Intermediário",
      AVANCADO:      "Avançado",
      Iniciante:     "Iniciante",
      Intermediário: "Intermediário",
      Avançado:      "Avançado",
    };
    const nivelRaw = (a.nivel ?? a.level ?? "").toString();
    const nivel    = NIVEL_MAP[nivelRaw] ?? null;

    const observacoes = Array.isArray(a.observacoes) ? a.observacoes : [];

    return { id: a.id, nome, initials, nivel, observacoes };
  });
}


export async function gerarPlano(message, students) {
  try {
    const { data } = await api.post('/trainer/plano', {
      message,
      students: students.map(s => ({
        id:          s.id,
        nome:        s.nome,
        nivel:       s.nivel,
        observacoes: s.observacoes ?? [],
      })),
    });
    return data;
  } catch (error) {
    const fallback = 'O serviço de IA está temporariamente sobrecarregado. Aguarde alguns segundos e tente novamente.';
    const messageText = extractErrorMessage(error, fallback);
    throw new Error(messageText);
  }
}


export async function transcreverEGerarPlano(audioBase64, mimeType, students) {
  try {
    const { data } = await api.post('/trainer/transcrever', {
      audioBase64,
      mimeType,
      students: students.map(s => ({
        id:          s.id,
        nome:        s.nome,
        nivel:       s.nivel,
        observacoes: s.observacoes ?? [],
      })),
    });
    return data;
  } catch (error) {
    const fallback = 'O serviço de IA está temporariamente sobrecarregado. Aguarde alguns segundos e tente novamente.';
    const messageText = extractErrorMessage(error, fallback);
    throw new Error(messageText);
  }
}