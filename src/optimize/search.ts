import { refine, type ResolvedConcept } from '../refine/refine';
import { composeFallback, composeFromConcepts, type ComposableConcept } from '../refine/compose';
import { sigil, type SigilOptions } from '../core/sigil';
import { strength, type Profile } from '../strength/score';
import { synonymCandidatesOf } from './synonyms';

export interface OptimizeOptions {
  profile?: Profile;
  /** Máximo de combinações avaliadas por busca exaustiva antes de recorrer a busca gulosa. */
  maxCombinations?: number;
}

export interface ChosenConcept {
  category: ComposableConcept['category'];
  /** Palavra usada na frase final (pode ser o lema original ou um sinônimo). */
  lemma: string;
  gender: ComposableConcept['gender'];
  /** Lema canônico do léxico antes da otimização (para comparação/transparência). */
  original: string;
}

export interface OptimizeCandidate {
  refined: string;
  sigilo: string;
  score: number;
  profile: Profile;
  vowels: NonNullable<SigilOptions['vowels']>;
  chosen: ChosenConcept[];
}

export interface OptimizeResult {
  best: OptimizeCandidate;
  /** Até 3 alternativas seguintes, para transparência (não inclui `best`). */
  alternatives: OptimizeCandidate[];
  combinationsEvaluated: number;
  strategy: 'exhaustive' | 'greedy' | 'trivial';
}

const DEFAULT_MAX_COMBINATIONS = 500;
const VOWEL_MODES: NonNullable<SigilOptions['vowels']>[] = ['keep', 'remove'];

interface Slot {
  concept: ResolvedConcept;
  options: { lemma: string; gender: ComposableConcept['gender']; isOriginal: boolean }[];
}

function buildSlots(concepts: readonly ResolvedConcept[]): Slot[] {
  return concepts.map((concept) => {
    const options = [{ lemma: concept.lemma, gender: concept.gender, isOriginal: true }];
    for (const candidate of synonymCandidatesOf(concept.lemma)) {
      options.push({ lemma: candidate.lemma, gender: candidate.gender, isOriginal: false });
    }
    return { concept, options };
  });
}

function evaluate(
  composableConcepts: readonly ComposableConcept[],
  chosen: readonly ChosenConcept[],
  profile: Profile
): OptimizeCandidate {
  const refinedText = composeFromConcepts(composableConcepts);

  let best: OptimizeCandidate | null = null;
  for (const vowels of VOWEL_MODES) {
    const sigilo = sigil(refinedText, { vowels });
    const score = strength(sigilo, profile).score;
    if (!best || score > best.score) {
      best = { refined: refinedText, sigilo, score, profile, vowels, chosen: [...chosen] };
    }
  }

  return best as OptimizeCandidate;
}

function cartesianProduct<T>(lists: readonly T[][]): T[][] {
  return lists.reduce<T[][]>(
    (acc, list) => acc.flatMap((combo) => list.map((item) => [...combo, item])),
    [[]]
  );
}

function trivialCandidate(refinedText: string, vowels: NonNullable<SigilOptions['vowels']>, profile: Profile): OptimizeCandidate {
  const sigilo = sigil(refinedText, { vowels });
  return { refined: refinedText, sigilo, score: strength(sigilo, profile).score, profile, vowels, chosen: [] };
}

/**
 * Otimiza uma intenção: refina offline (Fase 2), depois busca — sobre
 * combinações de template × sinônimo (OpenWordNet-PT) × variante de
 * vogais — a composição que maximiza a força do sigilo (Fase 1).
 *
 * Exaustiva quando o espaço de busca é pequeno (comum: poucos conceitos,
 * poucos sinônimos por conceito); gulosa (uma passada, otimiza cada
 * conceito isoladamente) quando excede `maxCombinations`.
 */
export function optimize(text: string, options: OptimizeOptions = {}): OptimizeResult {
  const profile = options.profile ?? 'grafico';
  const maxCombinations = options.maxCombinations ?? DEFAULT_MAX_COMBINATIONS;

  const refined = refine(text);

  if (refined.concepts.length === 0) {
    const refinedText = composeFallback(refined.residualWords);
    const candidates = VOWEL_MODES.map((vowels) => trivialCandidate(refinedText, vowels, profile)).sort(
      (a, b) => b.score - a.score
    );

    return {
      best: candidates[0] as OptimizeCandidate,
      alternatives: candidates.slice(1),
      combinationsEvaluated: candidates.length,
      strategy: 'trivial',
    };
  }

  const slots = buildSlots(refined.concepts);
  const spaceSize = slots.reduce((acc, slot) => acc * slot.options.length, 1);

  const toChosen = (combo: Slot['options'][number][]): ChosenConcept[] =>
    combo.map((choice, i) => ({
      category: (slots[i] as Slot).concept.category,
      lemma: choice.lemma,
      gender: choice.gender,
      original: (slots[i] as Slot).concept.lemma,
    }));

  const toComposable = (chosen: readonly ChosenConcept[]): ComposableConcept[] =>
    chosen.map((c) => ({ lemma: c.lemma, gender: c.gender, category: c.category }));

  if (spaceSize <= maxCombinations) {
    const combos = cartesianProduct(slots.map((slot) => slot.options));
    const candidates = combos.map((combo) => {
      const chosen = toChosen(combo);
      return evaluate(toComposable(chosen), chosen, profile);
    });

    candidates.sort((a, b) => b.score - a.score);
    return {
      best: candidates[0] as OptimizeCandidate,
      alternatives: candidates.slice(1, 4),
      combinationsEvaluated: candidates.length,
      strategy: 'exhaustive',
    };
  }

  // Espaço grande demais para busca exaustiva: otimização gulosa — uma
  // passada por conceito, mantendo os demais no lema original.
  let current: ChosenConcept[] = toChosen(slots.map((slot) => ({ ...(slot.options[0] as Slot['options'][number]) })));
  let evaluated = 0;
  const seen: OptimizeCandidate[] = [];

  slots.forEach((slot, index) => {
    let bestChoice: ChosenConcept = current[index] as ChosenConcept;
    let bestScore = -Infinity;

    for (const option of slot.options) {
      const trialChoice: ChosenConcept = {
        category: slot.concept.category,
        lemma: option.lemma,
        gender: option.gender,
        original: slot.concept.lemma,
      };
      const trial = current.map((c, i) => (i === index ? trialChoice : c));
      const candidate = evaluate(toComposable(trial), trial, profile);
      evaluated += 1;
      seen.push(candidate);

      if (candidate.score > bestScore) {
        bestScore = candidate.score;
        bestChoice = trialChoice;
      }
    }

    current = current.map((c, i) => (i === index ? bestChoice : c));
  });

  seen.sort((a, b) => b.score - a.score);
  return {
    best: seen[0] as OptimizeCandidate,
    alternatives: seen.slice(1, 4),
    combinationsEvaluated: evaluated,
    strategy: 'greedy',
  };
}
