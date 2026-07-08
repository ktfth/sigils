import type { Profile } from './score';

export interface CalibrationPair {
  a: string;
  b: string;
  profile: Profile;
  note: string;
}

/**
 * Bateria de comparações par-a-par usada tanto pelo script de calibração
 * (scripts/calibrate-weights.ts) quanto pelo teste de regressão permanente
 * (test/calibration.test.ts) — fonte única para não haver deriva entre os
 * dois. Espera-se score(a) >= score(b) em todo par, sob os pesos de
 * PROFILE_WEIGHTS. A ordem esperada deriva de princípios documentados da
 * tradição (Spare/Carroll/Sherwin para "grafico"; Frater U∴D∴ para
 * "mantrico" — ver pesquisa da Fase 1), não de julgamento de um LLM.
 *
 * Cada par foi verificado computacionalmente (analyzeSigil + orientedTerms)
 * para confirmar quais termos estão empatados vs. quais diferem, antes de
 * ser aceito como verdade-fundamento — ver histórico de
 * scripts/calibrate-weights.ts para o processo de exploração.
 *
 * Lacuna reconhecida: não há par isolando `strokeCombinability` sozinho —
 * a tradição cita simetria e combinação de traços como "harmonia/estética"
 * sem ordenar uma acima da outra; inventar uma verdade-fundamento aqui
 * fabricaria uma ordem que a fonte não dá.
 */
export const CALIBRATION_PAIRS: readonly CalibrationPair[] = [
  {
    a: 'ABCDEF------',
    b: 'ABCDEF',
    profile: 'grafico',
    note: 'Compressão isolada (Spare: reduzir ao mínimo de formas) — os outros 4 termos são idênticos.',
  },
  {
    a: 'BCDHKM',
    b: 'FGJLPQ',
    profile: 'grafico',
    note: 'Simetria isolada (harmonia estética de Spare) — nonReadability/simplicity/vowelBalance idênticos.',
  },
  {
    a: 'BCDFG',
    b: 'AEIOU',
    profile: 'grafico',
    note: 'Remoção de vogais (Carroll/Sherwin) — par dependente de peso (symmetry favorece o lado oposto).',
  },
  {
    a: 'BCDFG',
    b: 'STRNT',
    profile: 'grafico',
    note: 'Não-legibilidade (censor psíquico de Spare) — vowelBalance/simplicity empatados.',
  },
  {
    a: 'XKQWZ',
    b: 'DERAS',
    profile: 'grafico',
    note: 'Bigramas raros vs. comuns de PT — vários termos concordam (não é isolamento único), mas nenhum favorece "b".',
  },
  {
    a: 'MNFST -- PL-  -B-V-',
    b: 'A----',
    profile: 'grafico',
    note: 'Ponta a ponta: sigilo de optimize() real vence controle degenerado ("AAAAA").',
  },
  {
    a: 'MNFST -- PL-  -B-V-',
    b: 'A E I O U',
    profile: 'grafico',
    note: 'Ponta a ponta: sigilo de optimize() real vence controle de vogais puras.',
  },
  {
    a: 'BACEDIFO',
    b: 'AEIOU',
    profile: 'mantrico',
    note: 'CV balanceado vence vogais puras (Frater U∴D∴: sigilo sonoro precisa alternar) — nonReadability/simplicity empatados.',
  },
  {
    a: 'BACEDIFO',
    b: 'BCDFGHJK',
    profile: 'mantrico',
    note: 'CV balanceado vence consoantes puras — mesmo N, mesma ratio (ambos sem traço).',
  },
];
