import { NEGATIVE_SURFACE_INDEX, POSITIVE_SURFACE_INDEX, type ConceptDefinition } from './lexicon';

/** Distância de edição clássica (DP), O(n*m). Léxico e tokens são curtos, custo é irrelevante. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current.push(Math.min((current[j - 1] as number) + 1, (previous[j] as number) + 1, (previous[j - 1] as number) + cost));
    }
    previous = current;
  }

  return previous[b.length] as number;
}

/**
 * Limiar de distância tolerado por tamanho da palavra. Palavras curtas
 * (≤4) não entram em correspondência aproximada — têm vizinhos demais a
 * distância 1 (risco alto de falso positivo, incluindo colidir com
 * stopwords). A tolerância cresce com o tamanho, mas fica sempre bem
 * abaixo de uma fração grande da palavra.
 */
function maxDistanceFor(length: number): number {
  if (length <= 4) return 0;
  if (length <= 7) return 1;
  return 2;
}

interface FuzzyEntry {
  form: string;
  concept: ConceptDefinition;
  isNegative: boolean;
}

let singleWordEntries: FuzzyEntry[] | null = null;

function getSingleWordEntries(): FuzzyEntry[] {
  if (singleWordEntries) return singleWordEntries;

  singleWordEntries = [
    ...[...POSITIVE_SURFACE_INDEX.entries()]
      .filter(([form]) => !form.includes(' '))
      .map(([form, concept]) => ({ form, concept, isNegative: false })),
    ...[...NEGATIVE_SURFACE_INDEX.entries()]
      .filter(([form]) => !form.includes(' '))
      .map(([form, concept]) => ({ form, concept, isNegative: true })),
  ];

  return singleWordEntries;
}

export interface FuzzyMatch {
  concept: ConceptDefinition;
  isNegative: boolean;
  matchedForm: string;
  distance: number;
}

/**
 * Correspondência aproximada para um único token fora do léxico exato
 * (ex.: "riquza" -> "riqueza"). Só retorna resultado se houver um único
 * candidato com a MENOR distância dentro do limiar — em caso de empate
 * entre conceitos diferentes, retorna null (mais seguro não corrigir do
 * que corrigir errado).
 */
export function fuzzyMatchToken(token: string): FuzzyMatch | null {
  const threshold = maxDistanceFor(token.length);
  if (threshold === 0) return null;

  let best: FuzzyEntry | null = null;
  let bestDistance = Infinity;
  let ambiguous = false;

  for (const entry of getSingleWordEntries()) {
    const distance = levenshtein(token, entry.form);
    if (distance > threshold) continue;

    if (distance < bestDistance) {
      best = entry;
      bestDistance = distance;
      ambiguous = false;
    } else if (distance === bestDistance && best && best.concept.lemma !== entry.concept.lemma) {
      ambiguous = true;
    }
  }

  if (!best || ambiguous) return null;

  return { concept: best.concept, isNegative: best.isNegative, matchedForm: best.form, distance: bestDistance };
}
