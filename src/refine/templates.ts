import type { Category, Gender } from './lexicon';

interface CategoryTemplate {
  /** Verbo de manifestação no presente, já capitalizado (início de frase). */
  verb: string;
  amplifier: Record<Gender, string>;
}

/**
 * Verbo + amplificador por categoria, calibrados contra os exemplos de
 * REFINAMENTO.md (ex.: "Manifesto coragem plena e inabalável",
 * "Atraio abundância financeira suficiente").
 */
export const CATEGORY_TEMPLATES: Record<Category, CategoryTemplate> = {
  virtude: {
    verb: 'Manifesto',
    amplifier: { f: 'plena e inabalável', m: 'pleno e inabalável' },
  },
  recurso: {
    verb: 'Atraio',
    amplifier: { f: 'financeira suficiente', m: 'financeiro suficiente' },
  },
  sentimento: {
    verb: 'Experimento',
    amplifier: { f: 'genuína e constante', m: 'genuíno e constante' },
  },
  resultado: {
    verb: 'Alcanço',
    amplifier: { f: 'notável e duradoura', m: 'notável e duradouro' },
  },
  saude: {
    verb: 'Manifesto',
    amplifier: { f: 'plena e vibrante', m: 'pleno e vibrante' },
  },
  habilidade: {
    verb: 'Desenvolvo',
    amplifier: { f: 'notável e crescente', m: 'notável e crescente' },
  },
  relacao: {
    verb: 'Cultivo',
    amplifier: { f: 'verdadeira e profunda', m: 'verdadeiro e profundo' },
  },
};

/** Verbo genérico usado quando nenhum conceito do léxico é reconhecido. */
export const FALLBACK_VERB = 'Manifesto';
