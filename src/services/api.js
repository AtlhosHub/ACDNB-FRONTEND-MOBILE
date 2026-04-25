import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;


export async function login(usuario, senha) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/usuarios/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: usuario, senha }),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  if (response.status === 401) throw new Error('Senha incorreta.');
  if (response.status === 404) throw new Error('Usuário não encontrado.');
  if (!response.ok)            throw new Error(`Erro ${response.status} - Tente novamente mais tarde.`);

  let data;
  
  try {
    data = await response.json();
  } catch {
    throw new Error('Resposta inválida do servidor. Tente novamente.');
  }

  const token = data.token ?? data.accessToken ?? data.access_token;
  if (!token) throw new Error('Erro interno no servidor. Tente novamente mais tarde.');

  await AsyncStorage.setItem(TOKEN_KEY, token);
  return token;
}


export async function logout() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}


export async function getAlunos() {
  const response = await fetch(`${BASE_URL}/trainer/alunos`, {
    method:  'GET',
    headers: await authHeaders(),
  });

  if (!response.ok) throw new Error(`Erro ao buscar alunos: ${response.status}`);

  const data = await response.json();

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

    const observacoes = Array.isArray(a.observacoes)
      ? a.observacoes
      : [];

    return { id: a.id, nome, initials, nivel, observacoes };
  });
}


export async function gerarPlano(message, students) {
  const response = await fetch(`${BASE_URL}/trainer/plano`, {
    method:  'POST',
    headers: await authHeaders(),
    body:    JSON.stringify({
      message,
      students: students.map(s => ({
        id:          s.id,
        nome:        s.nome,
        nivel:       s.nivel,
        observacoes: s.observacoes ?? [],
      })),
    }),
  });

  if (!response.ok) throw new Error(`Erro: ${response.status}`);
  return response.text();
}


export async function transcreverEGerarPlano(audioBase64, mimeType, students) {
  const response = await fetch(`${BASE_URL}/trainer/transcrever`, {
    method:  'POST',
    headers: await authHeaders(),
    body:    JSON.stringify({
      audioBase64,
      mimeType,
      students: students.map(s => ({
        id:          s.id,
        nome:        s.nome,
        nivel:       s.nivel,
        observacoes: s.observacoes ?? [],
      })),
    }),
  });

  if (!response.ok) throw new Error(`Erro ao transcrever: ${response.status}`);
  return response.text();
}