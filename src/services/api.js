const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function getAlunos() {
  const response = await fetch(`${BASE_URL}/trainer/alunos`, {
    method:  "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar alunos: ${response.status}`);
  }

  const data = await response.json();

  return data.map((a) => {
    const nome = a.nome ?? a.name ?? "";
    const partes = nome.trim().split(/\s+/);
    const initials =
      partes.length >= 2
        ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
        : nome.slice(0, 2).toUpperCase();

    // nivel pode vir como string legível ou como toString() de enum Java
    const NIVEL_MAP = {
      INICIANTE:     "Iniciante",
      INTERMEDIARIO: "Intermediário",
      AVANCADO:      "Avançado",
      Iniciante:     "Iniciante",
      Intermediário: "Intermediário",
      Avançado:      "Avançado",
    };
    const nivelRaw = (a.nivel ?? a.level ?? "").toString();
    const level = NIVEL_MAP[nivelRaw] ?? null;

    const obs = Array.isArray(a.observacoes)
      ? a.observacoes.join("; ")
      : (a.observacoes ?? a.obs ?? "");

    return { id: a.id, name: nome, initials, level, obs };
  });
}


export async function gerarPlano(message, students) {
  const response = await fetch(`${BASE_URL}/trainer/plano`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      students: students.map(s => ({
        id:          s.id,
        nome:        s.nome,
        nivel:       s.nivel,
        observacoes: s.observacoes ?? []
      }))
    }),
  });
  if (!response.ok) throw new Error(`Erro: ${response.status}`);
  return response.text();
}


export async function transcreverEGerarPlano(audioBase64, mimeType, students) {
  const response = await fetch(`${BASE_URL}/trainer/transcrever`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ audioBase64, mimeType, students }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao transcrever: ${response.status}`);
  }

  return response.text();
}