import { describe, expect, test } from 'bun:test';
import { sigil } from '../src/core/sigil';
import { analyzeSigil } from '../src/strength/metrics';
import { strength } from '../src/strength/score';

describe('analyzeSigil', () => {
  test('extrai letras mantidas, N e L de um sigilo já gerado', () => {
    const sigiloText = sigil('desejo ter força e coragem');
    const metrics = analyzeSigil(sigiloText);

    expect(metrics.distinctLetters.join('')).toBe('DESJOTRFÇACGM');
    expect(metrics.N).toBe(13);
    expect(metrics.L).toBe(22);
    expect(metrics.compressionRatio).toBeCloseTo(13 / 22, 10);
  });

  test('string vazia produz métricas neutras sem lançar erro', () => {
    const metrics = analyzeSigil('');
    expect(metrics.N).toBe(0);
    expect(metrics.L).toBe(0);
    expect(metrics.vowelFraction).toBe(0);
  });
});

describe('strength (perfil grafico)', () => {
  test('glifo compacto de consoantes distintas vence glifo de vogais soltas', () => {
    // Mesma quantidade de letras distintas (5), mas o glifo consonantal tem
    // redundância (L=8 > N=5) e zero vogais — a doutrina de Spare/Carroll
    // recompensa exatamente essas duas propriedades.
    const vogais = strength('AEIOU', 'grafico');
    const consoantes = strength('ZK-Q-X-V', 'grafico');

    expect(consoantes.score).toBeGreaterThan(vogais.score);
  });

  test('score de um sigilo real fica no intervalo [0,1] e soma os pesos corretamente', () => {
    const sigiloText = sigil('desejo ter força e coragem');
    const result = strength(sigiloText, 'grafico');

    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(1);

    const totalWeight = result.breakdown.reduce((sum, term) => sum + term.weight, 0);
    expect(totalWeight).toBeCloseTo(1, 10);
  });
});

describe('strength (perfil mantrico)', () => {
  test('glifo com vogais e consoantes balanceadas vence os dois extremos', () => {
    // O perfil mântrico busca um "sweet spot" de vogais (~30-50%) porque um
    // sigilo sonoro precisa alternar consoante/vogal para ser cantável —
    // nem só vogais, nem só consoantes.
    const soVogais = strength('AEIOU', 'mantrico');
    const soConsoantes = strength('ZK-Q-X-V', 'mantrico');
    const balanceado = strength('RAMOKISU', 'mantrico');

    expect(balanceado.score).toBeGreaterThan(soVogais.score);
    expect(balanceado.score).toBeGreaterThan(soConsoantes.score);
  });
});
