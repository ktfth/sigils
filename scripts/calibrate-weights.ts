#!/usr/bin/env bun
/**
 * Calibração dos pesos de força SEM LLM como juiz.
 *
 * Em vez de pedir a um modelo para julgar "qual sigilo é mais forte", este
 * script usa como verdade-fundamento a bateria de comparações par-a-par de
 * src/strength/calibration-battery.ts — cuja ordem esperada deriva
 * diretamente de princípios documentados da tradição, não de opinião de
 * modelo. Essa mesma bateria também vira teste de regressão permanente em
 * test/calibration.test.ts, usando a função strength() de produção.
 *
 * Este script busca, por amostragem aleatória sobre o simplex de pesos, um
 * vetor que satisfaça MAIS pares do que os pesos atuais. Só recomenda troca
 * se encontrar algo estritamente melhor em número de pares — nunca troca só
 * por margem maior quando os pesos atuais já passam 100% (isso levaria a um
 * canto degenerado do simplex — quase todo peso numa única dimensão — que
 * contradiz o motivo do score ser multi-fator, não a uma calibração real).
 *
 * Uso: bun run scripts/calibrate-weights.ts
 */
import { analyzeSigil } from '../src/strength/metrics';
import { orientedTerms, PROFILE_WEIGHTS, type Profile, type ProfileWeights } from '../src/strength/score';
import { CALIBRATION_PAIRS, type CalibrationPair } from '../src/strength/calibration-battery';

function scoreWith(text: string, profile: Profile, weights: ProfileWeights): number {
  const metrics = analyzeSigil(text);
  const terms = orientedTerms(metrics, profile);
  return (Object.keys(weights) as (keyof ProfileWeights)[]).reduce(
    (sum, key) => sum + terms[key].oriented * weights[key],
    0
  );
}

function evaluateWeights(
  weights: ProfileWeights,
  pairs: readonly CalibrationPair[]
): { passes: number; margin: number } {
  let passes = 0;
  let margin = 0;
  for (const pair of pairs) {
    const diff = scoreWith(pair.a, pair.profile, weights) - scoreWith(pair.b, pair.profile, weights);
    if (diff >= 0) passes += 1;
    margin += diff;
  }
  return { passes, margin };
}

function randomWeights(keys: (keyof ProfileWeights)[]): ProfileWeights {
  // Amostra do simplex via normalização de exponenciais (Dirichlet uniforme).
  const raw = keys.map(() => -Math.log(1 - Math.random()));
  const total = raw.reduce((s, v) => s + v, 0);
  const out = {} as ProfileWeights;
  keys.forEach((key, i) => {
    out[key] = (raw[i] as number) / total;
  });
  return out;
}

function distance(a: ProfileWeights, b: ProfileWeights, keys: (keyof ProfileWeights)[]): number {
  return Math.sqrt(keys.reduce((sum, key) => sum + (a[key] - b[key]) ** 2, 0));
}

function calibrateProfile(profile: Profile, samples = 20000): void {
  const pairs = CALIBRATION_PAIRS.filter((p) => p.profile === profile);
  const keys = Object.keys(PROFILE_WEIGHTS[profile]) as (keyof ProfileWeights)[];
  const current = PROFILE_WEIGHTS[profile];

  const currentResult = evaluateWeights(current, pairs);

  console.log(`\n=== Perfil: ${profile} (${pairs.length} pares) ===`);

  if (currentResult.passes === pairs.length) {
    for (const pair of pairs) console.log(`  [OK] ${pair.note}`);
    console.log(
      `\n>> Pesos atuais de "${profile}" satisfazem 100% dos pares (margem ${currentResult.margin.toFixed(4)}). Mantidos.`
    );
    return;
  }

  let best = { weights: current, ...currentResult, dist: 0 };

  for (let i = 0; i < samples; i += 1) {
    const candidate = randomWeights(keys);
    const result = evaluateWeights(candidate, pairs);
    const dist = distance(candidate, current, keys);

    const better =
      result.passes > best.passes ||
      (result.passes === best.passes && result.margin > best.margin) ||
      (result.passes === best.passes && result.margin === best.margin && dist < best.dist);

    if (better) best = { weights: candidate, ...result, dist };
  }

  console.log(
    `Pesos atuais:      ${JSON.stringify(current)} -> ${currentResult.passes}/${pairs.length} pares, margem ${currentResult.margin.toFixed(4)}`
  );
  console.log(
    `Melhor encontrado: ${JSON.stringify(
      Object.fromEntries(keys.map((k) => [k, +best.weights[k].toFixed(3)]))
    )} -> ${best.passes}/${pairs.length} pares, margem ${best.margin.toFixed(4)}`
  );

  for (const pair of pairs) {
    const diffCurrent = scoreWith(pair.a, pair.profile, current) - scoreWith(pair.b, pair.profile, current);
    console.log(`  [${diffCurrent >= 0 ? 'OK ' : 'FALHA'}] ${pair.note}`);
  }

  console.log(
    `\n>> CALIBRAÇÃO ENCONTROU MELHORIA para "${profile}" — pesos atuais falham ${
      pairs.length - currentResult.passes
    } par(es). Atualize PROFILE_WEIGHTS.${profile} em src/strength/score.ts.`
  );
}

calibrateProfile('grafico');
calibrateProfile('mantrico');
