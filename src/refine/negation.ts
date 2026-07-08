/**
 * Cues de negação em português. Escopo heurístico: os N tokens seguintes ao
 * cue são considerados "sob negação" (abordagem padrão em detecção de
 * escopo de negação para PLN, ver referências na pesquisa da Fase 2).
 */
export const NEGATION_CUES: ReadonlySet<string> = new Set([
  'não',
  'nunca',
  'jamais',
  'nem',
  'sem',
  'tampouco',
  'nenhum',
  'nenhuma',
  'nada',
  'ninguém',
]);

export const DEFAULT_NEGATION_SCOPE = 4;

/**
 * Verbos "de desejo" comuns em intenções vagas (não são stopwords
 * gramaticais, mas são ruído para o léxico de conceitos — "desejo" em
 * "desejo melhorar minha vida" não deve vazar para o texto final).
 */
export const INTENTION_VERBS: ReadonlySet<string> = new Set([
  'desejo',
  'quero',
  'preciso',
  'queria',
  'gostaria',
  'almejo',
  'busco',
  'procuro',
  'necessito',
  'pretendo',
]);

/**
 * Retorna o conjunto de índices de tokens que caem sob o escopo de algum
 * cue de negação encontrado em `tokens`.
 */
export function findNegatedIndices(
  tokens: readonly string[],
  scopeSize: number = DEFAULT_NEGATION_SCOPE
): Set<number> {
  const negated = new Set<number>();

  tokens.forEach((token, index) => {
    if (!NEGATION_CUES.has(token)) return;

    const scopeEnd = Math.min(tokens.length, index + 1 + scopeSize);
    for (let i = index + 1; i < scopeEnd; i += 1) {
      negated.add(i);
    }
  });

  return negated;
}
