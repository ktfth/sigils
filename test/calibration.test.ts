import { describe, expect, test } from 'bun:test';
import { strength } from '../src/strength/score';
import { CALIBRATION_PAIRS } from '../src/strength/calibration-battery';

// Trava em teste a bateria de calibração (ver scripts/calibrate-weights.ts
// e src/strength/calibration-battery.ts): cada par expressa uma ordem que
// deriva de princípios documentados da tradição de sigilização, não de
// julgamento de LLM. Se um destes falhar após mexer em metrics.ts ou
// score.ts, a mudança contradiz a doutrina que o score tenta operacionalizar.
describe('calibração de força (verdade-fundamento da tradição)', () => {
  test.each(CALIBRATION_PAIRS.map((pair) => [pair.note, pair] as const))('%s', (_note, pair) => {
    const scoreA = strength(pair.a, pair.profile).score;
    const scoreB = strength(pair.b, pair.profile).score;
    expect(scoreA).toBeGreaterThanOrEqual(scoreB);
  });
});
