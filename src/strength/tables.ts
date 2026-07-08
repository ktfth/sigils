/**
 * Tabelas estáticas usadas pelas métricas de força. Todas curadas à mão,
 * determinísticas e sem dependência externa — não são "verdade absoluta",
 * são aproximações documentadas dos princípios da tradição de sigilização.
 */

/**
 * Comutância aproximada de dígrafos em português (0 = raríssimo/estranho,
 * 1 = muito comum). Pares ausentes da tabela recebem o valor padrão baixo
 * definido em DEFAULT_BIGRAM_COMMONNESS — tratados como incomuns/estranhos,
 * o que é o comportamento correto para um glifo que busca não ser lido.
 */
export const COMMON_PT_BIGRAMS: Readonly<Record<string, number>> = Object.freeze({
  DE: 0.9,
  ES: 0.85,
  RA: 0.8,
  DO: 0.8,
  OS: 0.78,
  EN: 0.75,
  AR: 0.75,
  AS: 0.75,
  AL: 0.7,
  AN: 0.7,
  CO: 0.7,
  RE: 0.7,
  TA: 0.68,
  TE: 0.68,
  TO: 0.68,
  SE: 0.68,
  ER: 0.65,
  OR: 0.65,
  IN: 0.6,
  IS: 0.6,
  ON: 0.55,
  ST: 0.5,
  NT: 0.5,
  CA: 0.55,
  MA: 0.55,
  PA: 0.5,
  PR: 0.5,
  TR: 0.45,
  GR: 0.4,
  BR: 0.4,
  CH: 0.35,
  LH: 0.3,
  NH: 0.3,
  QU: 0.6,
});

export const DEFAULT_BIGRAM_COMMONNESS = 0.05;

/** Letras com eixo de simetria vertical, horizontal ou rotacional (maiúsculas). */
export const SYMMETRIC_LETTERS: ReadonlySet<string> = new Set(
  'ABCDEHIKMNOSTUVWXYZ'.split('')
);

/**
 * Traços primitivos por letra (aproximação de letterform sans-serif
 * maiúsculo): V=vertical, H=horizontal, D1=diagonal /, D2=diagonal \,
 * C=curva. Usado para estimar potencial de combinação num monograma.
 */
export const LETTER_STROKES: Readonly<Record<string, ReadonlySet<string>>> = Object.freeze({
  A: new Set(['D1', 'D2', 'H']),
  B: new Set(['V', 'C']),
  C: new Set(['C']),
  D: new Set(['V', 'C']),
  E: new Set(['V', 'H']),
  F: new Set(['V', 'H']),
  G: new Set(['C', 'H']),
  H: new Set(['V', 'H']),
  I: new Set(['V']),
  J: new Set(['V', 'C']),
  K: new Set(['V', 'D1', 'D2']),
  L: new Set(['V', 'H']),
  M: new Set(['V', 'D1', 'D2']),
  N: new Set(['V', 'D1']),
  O: new Set(['C']),
  P: new Set(['V', 'C']),
  Q: new Set(['C', 'D2']),
  R: new Set(['V', 'C', 'D1']),
  S: new Set(['C']),
  T: new Set(['V', 'H']),
  U: new Set(['V', 'C']),
  V: new Set(['D1', 'D2']),
  W: new Set(['D1', 'D2']),
  X: new Set(['D1', 'D2']),
  Y: new Set(['D1', 'D2', 'V']),
  Z: new Set(['H', 'D1']),
});

export function jaccard(a: ReadonlySet<string>, b: ReadonlySet<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Função triangular: 0 fora de [floorMin, floorMax], 1 no platô [peakMin, peakMax]. */
export function triangularPlateau(
  value: number,
  floorMin: number,
  peakMin: number,
  peakMax: number,
  floorMax: number
): number {
  if (value <= floorMin || value >= floorMax) return 0;
  if (value >= peakMin && value <= peakMax) return 1;
  if (value < peakMin) return (value - floorMin) / (peakMin - floorMin);
  return (floorMax - value) / (floorMax - peakMax);
}
