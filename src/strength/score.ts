import { analyzeSigil, type SigilMetrics } from './metrics';
import { triangularPlateau } from './tables';

export type Profile = 'grafico' | 'mantrico';

export interface ProfileWeights {
  nonReadability: number;
  simplicity: number;
  vowelBalance: number;
  symmetry: number;
  strokeCombinability: number;
}

/**
 * Pesos por perfil. "grafico" segue a doutrina de Spare/Carroll/Sherwin
 * (abstração e não-legibilidade acima de tudo). "mantrico" aproxima um
 * sigilo sonoro (Frater U∴D∴): recompensa vogais/pronunciabilidade e
 * reduz o peso de simetria/traços, que são conceitos visuais.
 *
 * Nota: pesos são configuráveis por design — a tradição nunca definiu
 * "força" numericamente; isto é uma operacionalização, não uma verdade.
 */
export const PROFILE_WEIGHTS: Readonly<Record<Profile, ProfileWeights>> = Object.freeze({
  grafico: {
    nonReadability: 0.3,
    simplicity: 0.3,
    vowelBalance: 0.15,
    symmetry: 0.15,
    strokeCombinability: 0.1,
  },
  mantrico: {
    nonReadability: 0.1,
    simplicity: 0.2,
    vowelBalance: 0.5,
    symmetry: 0.1,
    strokeCombinability: 0.1,
  },
});

export interface StrengthTerm {
  label: string;
  raw: number;
  oriented: number;
  weight: number;
  contribution: number;
}

export interface StrengthResult {
  profile: Profile;
  score: number;
  metrics: SigilMetrics;
  breakdown: StrengthTerm[];
}

function simplicityTerm(metrics: SigilMetrics): number {
  const redundancy = 1 - metrics.compressionRatio;
  const sweetSpot = triangularPlateau(metrics.N, 2, 4, 8, 12);
  return (redundancy + sweetSpot) / 2;
}

/** Exportado para reuso pelo script de calibração (scripts/calibrate-weights.ts). */
export function orientedTerms(
  metrics: SigilMetrics,
  profile: Profile
): Record<keyof ProfileWeights, { label: string; raw: number; oriented: number }> {
  const simplicity = simplicityTerm(metrics);

  if (profile === 'grafico') {
    return {
      nonReadability: {
        label: 'Não-legibilidade',
        raw: metrics.avgBigramCommonness,
        oriented: 1 - metrics.avgBigramCommonness,
      },
      simplicity: { label: 'Simplicidade', raw: metrics.compressionRatio, oriented: simplicity },
      vowelBalance: {
        label: 'Balanço de vogais',
        raw: metrics.vowelFraction,
        oriented: 1 - metrics.vowelFraction,
      },
      symmetry: { label: 'Simetria', raw: metrics.symmetryFraction, oriented: metrics.symmetryFraction },
      strokeCombinability: {
        label: 'Combinação de traços',
        raw: metrics.strokeCombinability,
        oriented: metrics.strokeCombinability,
      },
    };
  }

  return {
    nonReadability: {
      label: 'Pronunciabilidade',
      raw: metrics.avgBigramCommonness,
      oriented: metrics.avgBigramCommonness,
    },
    simplicity: { label: 'Simplicidade', raw: metrics.compressionRatio, oriented: simplicity },
    vowelBalance: {
      label: 'Balanço de vogais (mântrico)',
      raw: metrics.vowelFraction,
      oriented: triangularPlateau(metrics.vowelFraction, 0.1, 0.3, 0.5, 0.7),
    },
    symmetry: { label: 'Simetria', raw: metrics.symmetryFraction, oriented: metrics.symmetryFraction },
    strokeCombinability: {
      label: 'Combinação de traços',
      raw: metrics.strokeCombinability,
      oriented: metrics.strokeCombinability,
    },
  };
}

export function strengthFromMetrics(
  metrics: SigilMetrics,
  profile: Profile = 'grafico',
  weightsOverride?: ProfileWeights
): StrengthResult {
  const weights = weightsOverride ?? PROFILE_WEIGHTS[profile];
  const terms = orientedTerms(metrics, profile);

  const breakdown: StrengthTerm[] = (Object.keys(weights) as (keyof ProfileWeights)[]).map((key) => {
    const term = terms[key];
    const weight = weights[key];
    return { label: term.label, raw: term.raw, oriented: term.oriented, weight, contribution: term.oriented * weight };
  });

  const score = breakdown.reduce((sum, term) => sum + term.contribution, 0);

  return { profile, score, metrics, breakdown };
}

/** Calcula a força de um sigilo já gerado (saída de sigil()). */
export function strength(
  sigiloText: string,
  profile: Profile = 'grafico',
  weightsOverride?: ProfileWeights
): StrengthResult {
  return strengthFromMetrics(analyzeSigil(sigiloText), profile, weightsOverride);
}
