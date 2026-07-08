import type { Gender } from '../refine/lexicon';

/**
 * Heurística de gênero gramatical para substantivos em português por
 * sufixo — cobre a maioria dos casos comuns, mas português tem exceções
 * reais (ex.: "a dor", "a cor", mas "o calor"). Palavras não cobertas por
 * regra nem por override retornam null e são excluídas do pool de
 * substituição do otimizador (mais seguro excluir do que arriscar
 * concordância errada, ex.: "denodo pleno" vs. "denodo plena").
 *
 * A tabela de overrides abaixo foi verificada à mão contra o vocabulário
 * real extraído do OpenWordNet-PT (ver scripts/extract-openwordnet-synonyms.ts).
 */
const GENDER_OVERRIDES: Readonly<Record<string, Gender>> = Object.freeze({
  dor: 'f',
  cor: 'f',
  flor: 'f',
  mão: 'f',
  foz: 'f',
  tribo: 'f',
  libido: 'f',
  empurrão: 'm',
  escuridão: 'f',
  lassidão: 'f',
  questão: 'f',
  solidão: 'f',
  albumen: 'm',
  albúmen: 'm',
  baluarte: 'm',
  bem: 'm',
  cache: 'm',
  caos: 'm',
  cobre: 'm',
  cobres: 'm',
  combate: 'm',
  conflitos: 'm',
  deficit: 'm',
  doenças: 'f',
  elã: 'm',
  estresse: 'm',
  excedente: 'm',
  finanças: 'f',
  fome: 'f',
  forte: 'm',
  fundos: 'm',
  fé: 'f',
  nó: 'm',
  paz: 'f',
  performance: 'f',
  pesar: 'm',
  pobres: 'm',
  poder: 'm',
  pose: 'f',
  prazer: 'm',
  saúde: 'f',
  transe: 'm',
  verve: 'f',
  óbice: 'm',
});

const FEMININE_SUFFIXES = [
  'dade',
  'tude',
  'ção',
  'são',
  'xão',
  'gem',
  'eza',
  'ez',
  'ência',
  'ância',
  'ície',
  'ice',
  'ude',
];

const MASCULINE_SUFFIXES = ['ema', 'isso', 'ismo', 'or', 'al', 'il', 'um', 'ete'];

/**
 * Retorna o gênero mais provável de um substantivo em português, ou null
 * se não houver evidência confiável (nesse caso o chamador deve descartar
 * a palavra em vez de arriscar).
 */
export function guessGender(word: string): Gender | null {
  const lower = word.toLowerCase();

  const override = GENDER_OVERRIDES[lower];
  if (override) return override;

  for (const suffix of FEMININE_SUFFIXES) {
    if (lower.endsWith(suffix)) return 'f';
  }
  for (const suffix of MASCULINE_SUFFIXES) {
    if (lower.endsWith(suffix)) return 'm';
  }

  // "-ão" sem ser -ção/-são/-xão é ambíguo em PT (questão=f, coração=m) —
  // só decide via override explícito, nunca por fallback genérico.
  if (lower.endsWith('ão')) return null;
  if (lower.endsWith('a')) return 'f';
  if (lower.endsWith('o')) return 'm';

  return null;
}
