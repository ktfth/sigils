import { isVowel } from '../core/normalize';
import {
  COMMON_PT_BIGRAMS,
  DEFAULT_BIGRAM_COMMONNESS,
  LETTER_STROKES,
  SYMMETRIC_LETTERS,
  jaccard,
} from './tables';

export interface SigilMetrics {
  /** Letras distintas mantidas no glifo, na ordem em que aparecem. */
  distinctLetters: string[];
  /** N: quantidade de letras distintas. */
  N: number;
  /** L: total de letras da intenção original (mantidas + substituídas por traço). */
  L: number;
  /** N/L — quanto menor, mais redundância a intenção original tinha. */
  compressionRatio: number;
  /** Fração das letras distintas que são vogais. */
  vowelFraction: number;
  /** Comutância média dos dígrafos consecutivos do glifo (0=raro, 1=comum). */
  avgBigramCommonness: number;
  /** Fração das letras distintas com algum eixo de simetria. */
  symmetryFraction: number;
  /** Similaridade média (Jaccard) de traços primitivos entre pares de letras. */
  strokeCombinability: number;
}

/**
 * Extrai as letras "vivas" de um texto de sigilo já gerado (mantidas vs.
 * substituídas por traço), ignorando espaços. Funciona diretamente sobre a
 * saída de sigil(), então mede o glifo final — não a intenção original.
 */
function extractGlyphLetters(sigiloText: string): { kept: string[]; L: number } {
  const kept: string[] = [];
  let L = 0;

  for (const c of sigiloText) {
    if (c === ' ') continue;
    if (c === '-') {
      L += 1;
      continue;
    }
    kept.push(c);
    L += 1;
  }

  return { kept, L };
}

function avgBigramCommonness(letters: readonly string[]): number {
  if (letters.length < 2) return DEFAULT_BIGRAM_COMMONNESS;

  let total = 0;
  let pairs = 0;

  for (let i = 0; i < letters.length - 1; i += 1) {
    const bigram = `${letters[i]}${letters[i + 1]}`;
    total += COMMON_PT_BIGRAMS[bigram] ?? DEFAULT_BIGRAM_COMMONNESS;
    pairs += 1;
  }

  return total / pairs;
}

function strokeCombinability(letters: readonly string[]): number {
  if (letters.length < 2) return 0;

  let total = 0;
  let pairs = 0;

  for (let i = 0; i < letters.length; i += 1) {
    for (let j = i + 1; j < letters.length; j += 1) {
      const a = LETTER_STROKES[letters[i] as string];
      const b = LETTER_STROKES[letters[j] as string];
      if (!a || !b) continue;
      total += jaccard(a, b);
      pairs += 1;
    }
  }

  return pairs === 0 ? 0 : total / pairs;
}

export function analyzeSigil(sigiloText: string): SigilMetrics {
  const { kept, L } = extractGlyphLetters(sigiloText);
  const N = kept.length;

  const vowelCount = kept.filter((c) => isVowel(c)).length;
  const symmetricCount = kept.filter((c) => SYMMETRIC_LETTERS.has(c)).length;

  return {
    distinctLetters: kept,
    N,
    L,
    compressionRatio: L === 0 ? 0 : N / L,
    vowelFraction: N === 0 ? 0 : vowelCount / N,
    avgBigramCommonness: avgBigramCommonness(kept),
    symmetryFraction: N === 0 ? 0 : symmetricCount / N,
    strokeCombinability: strokeCombinability(kept),
  };
}
