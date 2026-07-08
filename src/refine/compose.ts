import type { Category, Gender } from './lexicon';
import { CATEGORY_TEMPLATES, FALLBACK_VERB } from './templates';

/** Forma mínima necessária para compor uma frase: usada por refine() e pelo otimizador (Fase 3). */
export interface ComposableConcept {
  lemma: string;
  gender: Gender;
  category: Category;
}

function joinWithE(items: readonly string[]): string {
  if (items.length === 1) return items[0] as string;
  if (items.length === 2) return `${items[0]} e ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

export function composeFromConcepts(concepts: readonly ComposableConcept[]): string {
  if (concepts.length === 1) {
    const concept = concepts[0] as ComposableConcept;
    const template = CATEGORY_TEMPLATES[concept.category];
    return `${template.verb} ${concept.lemma} ${template.amplifier[concept.gender]}`;
  }

  const dominant = concepts[0] as ComposableConcept;
  const template = CATEGORY_TEMPLATES[dominant.category];
  const nouns = joinWithE(concepts.map((c) => c.lemma));
  return `${template.verb} ${nouns} com plenitude e convicção`;
}

export function composeFallback(residualWords: readonly string[]): string {
  if (residualWords.length === 0) {
    return `${FALLBACK_VERB} clareza sobre minha intenção`;
  }
  return `${FALLBACK_VERB} ${residualWords.join(' ')}`;
}
