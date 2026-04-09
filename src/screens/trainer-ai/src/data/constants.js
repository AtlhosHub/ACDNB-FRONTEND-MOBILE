// ─────────────────────────────────────────────────────────────────────────────
// constants.js — Chaves de API, labels e cores por nível
// ─────────────────────────────────────────────────────────────────────────────

// ── Chaves de API ─────────────────────────────────────────────────────────────
// Defina no arquivo .env na raiz do projeto (nunca commite-lo)
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "";

// ── Labels de nível ───────────────────────────────────────────────────────────
export const LEVEL_LABEL = {
  Iniciante:     "Iniciante",
  Intermediário: "Intermediário",
  Avançado:      "Avançado",
};

// ── Cores por nível (badge e pill) ────────────────────────────────────────────
export const LEVEL_COLOR = {
  Iniciante:     { bg: "#E6F1FB", text: "#0C447C" },
  Intermediário: { bg: "#FAEEDA", text: "#633806" },
  Avançado:      { bg: "#E1F5EE", text: "#085041" },
};

// ── Cores de avatar (rodízio por índice) ──────────────────────────────────────
export const AVATAR_COLORS = [
  { bg: "#E6F1FB", text: "#0C447C" },
  { bg: "#E1F5EE", text: "#085041" },
  { bg: "#FAEEDA", text: "#633806" },
  { bg: "#FAECE7", text: "#712B13" },
  { bg: "#EEEDFE", text: "#3C3489" },
];

// ── Cor principal do app ──────────────────────────────────────────────────────
export const BRAND_BLUE       = "#1652A1";
export const BRAND_BLUE_LIGHT = "#E6F1FB";