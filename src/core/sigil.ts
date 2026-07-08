import { toUpperCase, isVowel } from './normalize';

export interface SigilOptions {
  /**
   * 'keep' (padrão) preserva o comportamento histórico do algoritmo.
   * 'remove' aplica a variante Carroll/Sherwin: remove vogais antes de
   * deduplicar consoantes, resultando em glifos menos legíveis.
   */
  vowels?: 'keep' | 'remove';
}

function stripVowels(input: string): string {
  return input
    .split('')
    .filter((c) => c === ' ' || !isVowel(c))
    .join('');
}

/**
 * Transforma uma intenção em um sigilo.
 *
 * Mantém apenas a primeira ocorrência de cada letra; ocorrências
 * repetidas são substituídas por traços (-).
 */
export function sigil(intention: string, options: SigilOptions = {}): string {
  const { vowels = 'keep' } = options;
  const capsIntention = toUpperCase(intention);
  const source = vowels === 'remove' ? stripVowels(capsIntention) : capsIntention;

  const seen: Record<string, number> = {};
  const out: string[] = [];

  for (const c of source.split('')) {
    if (c !== ' ' && seen[c] === undefined) {
      seen[c] = 1;
    } else if (c !== ' ' && seen[c] !== undefined) {
      seen[c] = (seen[c] ?? 0) + 1;
    }

    if (c === ' ' || seen[c] === 1) {
      out.push(c);
    } else if ((seen[c] ?? 0) > 1) {
      out.push('-');
    }
  }

  return out.join('');
}
