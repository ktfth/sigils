import rawSynonyms from '../refine/data/openwordnet-synonyms.json';
import { guessGender } from './gender';
import type { Gender } from '../refine/lexicon';

/**
 * O OpenWordNet-PT não desambigua sentido: um synset de substantivo pode
 * agrupar acepções distantes da usada em intenções positivas (ex.: "força"
 * também aparece no sentido de "violência" em outro synset). Bloqueio
 * curado à mão a partir da revisão do extrato — ver
 * src/refine/data/ATTRIBUTION.md.
 */
const SENSE_BLOCKLIST: Readonly<Record<string, readonly string[]>> = Object.freeze({
  força: ['violência'],
  confiança: ['dependência', 'pose'],
  conexão: ['fornecedor', 'baldeação'],
  disciplina: ['campo', 'domínio', 'modalidade'],
  amor: ['cupido', 'dolorimento', 'finura', 'amante'],
  paz: ['silêncio'],
  sucesso: ['estrondo'],
  saúde: ['eudemonismo'],
});

export interface SynonymCandidate {
  lemma: string;
  gender: Gender;
}

/**
 * Sinônimos de `lemma` com gênero resolvido, prontos para substituição no
 * template. Candidatos sem gênero confiável (guessGender retorna null) ou
 * bloqueados por sentido são excluídos — mais seguro excluir do que
 * arriscar concordância ou tom errados.
 */
export function synonymCandidatesOf(lemma: string): SynonymCandidate[] {
  const key = lemma.toLowerCase();
  const raw = (rawSynonyms as Record<string, string[]>)[key] ?? [];
  const blocked = new Set(SENSE_BLOCKLIST[key] ?? []);

  const candidates: SynonymCandidate[] = [];
  for (const word of raw) {
    if (blocked.has(word)) continue;
    const gender = guessGender(word);
    if (!gender) continue;
    candidates.push({ lemma: word, gender });
  }
  return candidates;
}
