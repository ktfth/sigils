import { porBr } from 'stopword';
import { tokenize } from './tokenize';
import { findNegatedIndices, INTENTION_VERBS, NEGATION_CUES } from './negation';
import {
  MAX_SURFACE_FORM_TOKENS,
  NEGATIVE_SURFACE_INDEX,
  POSITIVE_SURFACE_INDEX,
  type Category,
  type Gender,
} from './lexicon';
import { fuzzyMatchToken } from './fuzzy';
import { composeFallback, composeFromConcepts } from './compose';

const STOPWORD_SET = new Set(porBr);

export interface ResolvedConcept {
  lemma: string;
  gender: Gender;
  category: Category;
  /** true se veio de uma forma negativa direta ("medo") ou de negação explícita resolvida. */
  wasNegated: boolean;
  /** true se o casamento veio de correspondência aproximada (ex.: "riquza" -> "riqueza"). */
  wasFuzzy: boolean;
}

export type Confidence = 'alta' | 'media' | 'baixa';

export interface RefineResult {
  original: string;
  refined: string;
  concepts: ResolvedConcept[];
  /** Palavras de conteúdo não reconhecidas pelo léxico (transparência, não usadas no resultado). */
  residualWords: string[];
  warnings: string[];
  confidence: Confidence;
}

/**
 * Refina uma intenção 100% offline: tokeniza, resolve negações (cues +
 * escopo, e também estados negativos mencionados diretamente como "medo"),
 * casa o que sobra contra o léxico curado e compõe uma frase no presente,
 * em linguagem culta, sem negações, concordando gênero automaticamente.
 */
export function refine(text: string): RefineResult {
  const tokens = tokenize(text);
  const explicitNegated = findNegatedIndices(tokens);
  const consumed = new Array<boolean>(tokens.length).fill(false);
  const resolvedByLemma = new Map<string, ResolvedConcept>();
  const warnings: string[] = [];

  let i = 0;
  while (i < tokens.length) {
    let matchedSpan = 0;
    let matchedLemma: string | undefined;
    let matchedGender: Gender | undefined;
    let matchedCategory: Category | undefined;
    let isFromNegativeForm = false;
    let isFuzzy = false;

    for (let span = Math.min(MAX_SURFACE_FORM_TOKENS, tokens.length - i); span >= 1; span -= 1) {
      const candidate = tokens.slice(i, i + span).join(' ');
      const negative = NEGATIVE_SURFACE_INDEX.get(candidate);
      const positive = POSITIVE_SURFACE_INDEX.get(candidate);

      if (negative) {
        matchedLemma = negative.lemma;
        matchedGender = negative.gender;
        matchedCategory = negative.category;
        isFromNegativeForm = true;
        matchedSpan = span;
        break;
      }

      if (positive) {
        matchedLemma = positive.lemma;
        matchedGender = positive.gender;
        matchedCategory = positive.category;
        isFromNegativeForm = false;
        matchedSpan = span;
        break;
      }
    }

    // Sem match exato: tenta correspondência aproximada (erro de digitação)
    // no token isolado. Nunca em palavras funcionais (negação/stopword/verbo
    // de desejo) — não faz sentido corrigi-las contra o léxico de conceitos.
    if (!matchedLemma) {
      const token = tokens[i] as string;
      const isFunctionWord =
        NEGATION_CUES.has(token) || STOPWORD_SET.has(token) || INTENTION_VERBS.has(token);

      if (!isFunctionWord) {
        const fuzzy = fuzzyMatchToken(token);
        if (fuzzy) {
          matchedLemma = fuzzy.concept.lemma;
          matchedGender = fuzzy.concept.gender;
          matchedCategory = fuzzy.concept.category;
          isFromNegativeForm = fuzzy.isNegative;
          matchedSpan = 1;
          isFuzzy = true;
          warnings.push(
            `Correção aproximada: "${token}" interpretado como "${fuzzy.matchedForm}" (distância ${fuzzy.distance}).`
          );
        }
      }
    }

    if (!matchedLemma || !matchedGender || !matchedCategory) {
      i += 1;
      continue;
    }

    for (let k = i; k < i + matchedSpan; k += 1) consumed[k] = true;

    // Estado negativo mencionado direto ("medo") ou conceito positivo dentro
    // do escopo de uma negação ("não tenho confiança") resolvem para o MESMO
    // alvo positivo: em ambos os casos a pessoa está descrevendo uma
    // ausência, e o que falta é exatamente o que deve ser manifestado.
    const wasNegated = isFromNegativeForm || explicitNegated.has(i);
    const existing = resolvedByLemma.get(matchedLemma);

    if (!existing) {
      resolvedByLemma.set(matchedLemma, {
        lemma: matchedLemma,
        gender: matchedGender,
        category: matchedCategory,
        wasNegated,
        wasFuzzy: isFuzzy,
      });
    } else if ((wasNegated && !existing.wasNegated) || (isFuzzy && !existing.wasFuzzy)) {
      resolvedByLemma.set(matchedLemma, {
        ...existing,
        wasNegated: existing.wasNegated || wasNegated,
        wasFuzzy: existing.wasFuzzy || isFuzzy,
      });
    }

    i += matchedSpan;
  }

  // Palavras sob negação explícita que o léxico não reconheceu: não dá para
  // afirmá-las com segurança, então saem do resultado (não só do fallback).
  for (const index of explicitNegated) {
    if (consumed[index]) continue;
    const token = tokens[index] as string;
    if (NEGATION_CUES.has(token) || STOPWORD_SET.has(token) || INTENTION_VERBS.has(token)) continue;
    consumed[index] = true;
    warnings.push(`Palavra negada não reconhecida pelo léxico: "${token}" — omitida do resultado.`);
  }

  const concepts = [...resolvedByLemma.values()];
  const residualWords = tokens.filter(
    (token, index) =>
      !consumed[index] &&
      !NEGATION_CUES.has(token) &&
      !STOPWORD_SET.has(token) &&
      !INTENTION_VERBS.has(token)
  );

  const refined =
    concepts.length === 0 ? composeFallback(residualWords) : composeFromConcepts(concepts);
  const confidence: Confidence =
    concepts.length === 0 ? 'baixa' : warnings.length === 0 ? 'alta' : 'media';

  return { original: text, refined, concepts, residualWords, warnings, confidence };
}
