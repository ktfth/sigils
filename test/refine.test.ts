import { describe, expect, test } from 'bun:test';
import { refine } from '../src/refine/refine';

describe('refine (negação → antônimo)', () => {
  test('nega estado direto ("medo") e resolve para o antônimo positivo', () => {
    const result = refine('quero não ter medo');
    expect(result.refined).toBe('Manifesto coragem plena e inabalável');
    expect(result.confidence).toBe('alta');
    expect(result.concepts).toEqual([
      { lemma: 'coragem', gender: 'f', category: 'virtude', wasNegated: true, wasFuzzy: false },
    ]);
  });

  test('nega conceito positivo por cue explícito ("não tenho confiança")', () => {
    const result = refine('não tenho confiança');
    expect(result.refined).toBe('Manifesto confiança plena e inabalável');
    expect(result.confidence).toBe('alta');
    expect(result.concepts[0]?.wasNegated).toBe(true);
  });

  test('"sem X" nega X mesmo sem a palavra "não"', () => {
    const result = refine('estou sempre cansado e sem energia');
    expect(result.refined).toBe('Manifesto vitalidade plena e vibrante');
  });

  test('palavra negada fora do léxico não vaza para o resultado', () => {
    const result = refine('não quero programar mais');
    expect(result.refined).not.toContain('programar');
    expect(result.confidence).toBe('baixa');
    expect(result.warnings.some((w) => w.includes('programar'))).toBe(true);
  });
});

describe('refine (correção aproximada de erro de digitação)', () => {
  test('corrige typo de uma letra e resolve o conceito ("riquza" -> "riqueza")', () => {
    const result = refine('Eu desejo obter a riquza de um sultão');
    expect(result.refined).toBe('Atraio abundância financeira suficiente');
    expect(result.concepts[0]?.wasFuzzy).toBe(true);
    expect(result.confidence).toBe('media');
    expect(result.warnings.some((w) => w.includes('riquza') && w.includes('riqueza'))).toBe(true);
  });

  test('não corrige palavras funcionais (stopwords/negação/verbos de desejo)', () => {
    const result = refine('quero não ter medo');
    expect(result.concepts.every((c) => !c.wasFuzzy)).toBe(true);
  });

  test('variante morfológica próxima também resolve ("brigar" -> "briga")', () => {
    const result = refine('não quero brigar mais');
    expect(result.refined).toBe('Manifesto paz plena e inabalável');
    expect(result.concepts[0]?.wasFuzzy).toBe(true);
    expect(result.concepts[0]?.wasNegated).toBe(true);
  });
});

describe('refine (concordância de gênero)', () => {
  test('concordância feminina (coragem)', () => {
    expect(refine('desejo coragem').refined).toBe('Manifesto coragem plena e inabalável');
  });

  test('concordância masculina (sucesso)', () => {
    expect(refine('quero ter sucesso').refined).toBe('Alcanço sucesso notável e duradouro');
  });

  test('concordância masculina (amor)', () => {
    expect(refine('desejo amor').refined).toBe('Cultivo amor verdadeiro e profundo');
  });
});

describe('refine (múltiplos conceitos)', () => {
  test('combina dois conceitos com o verbo do primeiro e amplificador invariante', () => {
    const result = refine('desejo ter força e coragem');
    expect(result.refined).toBe('Manifesto força e coragem com plenitude e convicção');
    expect(result.concepts.map((c) => c.lemma)).toEqual(['força', 'coragem']);
  });

  test('verbos de desejo ("desejo", "quero", "preciso") não vazam para a saída', () => {
    const result = refine('preciso de dinheiro');
    expect(result.refined).toBe('Atraio abundância financeira suficiente');
    expect(result.refined).not.toMatch(/preciso|desejo|quero/i);
  });
});

describe('refine (fallback sem conceito reconhecido)', () => {
  test('usa palavras de conteúdo residuais quando nada do léxico casa', () => {
    const result = refine('desejo melhorar minha vida');
    expect(result.confidence).toBe('baixa');
    expect(result.concepts).toEqual([]);
    expect(result.refined).toContain('melhorar');
    expect(result.refined).toContain('vida');
  });

  test('frase totalmente vazia de conteúdo cai num fallback genérico', () => {
    const result = refine('não quero nada');
    expect(result.confidence).toBe('baixa');
    expect(result.refined.length).toBeGreaterThan(0);
  });
});

describe('refine (exemplos calibrados contra REFINAMENTO.md)', () => {
  test.each([
    ['quero não ter medo', 'Manifesto coragem plena e inabalável'],
    ['preciso de dinheiro', 'Atraio abundância financeira suficiente'],
    ['quero ter sucesso', 'Alcanço sucesso notável e duradouro'],
  ])('%s -> %s', (input, expected) => {
    expect(refine(input).refined).toBe(expected);
  });
});
