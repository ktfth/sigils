import { describe, expect, test } from 'bun:test';
import { optimize } from '../src/optimize/search';
import { guessGender } from '../src/optimize/gender';
import { synonymCandidatesOf } from '../src/optimize/synonyms';
import { refine } from '../src/refine/refine';
import { sigil } from '../src/core/sigil';
import { strength } from '../src/strength/score';

describe('guessGender', () => {
  test.each([
    ['coragem', 'f'],
    ['denodo', 'm'],
    ['dor', 'f'],
    ['cor', 'f'],
    ['calor', 'm'],
    ['questão', 'f'],
    ['empurrão', 'm'],
    ['sabedoria', 'f'],
    ['sucesso', 'm'],
    ['saúde', 'f'],
  ])('%s -> %s', (word, expected) => {
    expect(guessGender(word)).toBe(expected);
  });

  test('retorna null para palavras sem evidência confiável', () => {
    expect(guessGender('xyz')).toBeNull();
  });
});

describe('synonymCandidatesOf', () => {
  test('nunca inclui sinônimos bloqueados por sentido (polissemia)', () => {
    const forca = synonymCandidatesOf('força').map((c) => c.lemma);
    expect(forca).not.toContain('violência');

    const confianca = synonymCandidatesOf('confiança').map((c) => c.lemma);
    expect(confianca).not.toContain('dependência');
    expect(confianca).not.toContain('pose');
  });

  test('todo candidato tem gênero resolvido', () => {
    for (const candidate of synonymCandidatesOf('coragem')) {
      expect(['f', 'm']).toContain(candidate.gender);
    }
  });

  test('palavra sem entrada no extrato retorna lista vazia', () => {
    expect(synonymCandidatesOf('palavra-inexistente-xyz')).toEqual([]);
  });
});

describe('optimize', () => {
  test('nunca piora em relação à composição sem otimização (mesmo perfil)', () => {
    const cases = ['quero não ter medo', 'preciso de dinheiro', 'desejo ter força e coragem'];

    for (const text of cases) {
      const base = refine(text);
      const baselineBest = Math.max(
        strength(sigil(base.refined, { vowels: 'keep' }), 'grafico').score,
        strength(sigil(base.refined, { vowels: 'remove' }), 'grafico').score
      );

      const result = optimize(text);
      expect(result.best.score).toBeGreaterThanOrEqual(baselineBest);
    }
  });

  test('inclui o lema original como candidato (nunca força uma troca)', () => {
    const result = optimize('quero não ter medo');
    const originalWasKept = result.best.chosen.every((c) => c.lemma === c.original) ||
      result.alternatives.some((alt) => alt.chosen.every((c) => c.lemma === c.original));
    expect(originalWasKept).toBe(true);
  });

  test('frase sem conceito reconhecido cai em estratégia trivial sem lançar erro', () => {
    const result = optimize('não quero programar mais');
    expect(result.strategy).toBe('trivial');
    expect(result.best.chosen).toEqual([]);
  });

  test('espaço de busca pequeno usa estratégia exaustiva', () => {
    const result = optimize('quero não ter medo');
    expect(result.strategy).toBe('exhaustive');
  });

  test('maxCombinations baixo força estratégia gulosa', () => {
    const result = optimize('desejo ter força e coragem', { maxCombinations: 1 });
    expect(result.strategy).toBe('greedy');
    expect(result.best.score).toBeGreaterThan(0);
  });

  test('perfil mantrico produz um resultado válido e coerente com o perfil', () => {
    const result = optimize('quero não ter medo', { profile: 'mantrico' });
    expect(result.best.profile).toBe('mantrico');
    expect(result.best.score).toBeGreaterThan(0);
  });
});
