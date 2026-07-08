export { sigil } from './core/sigil';
export type { SigilOptions } from './core/sigil';
export { analyzeSigil, strength, strengthFromMetrics } from './strength';
export type { SigilMetrics, Profile, StrengthResult, StrengthTerm } from './strength';
export { refine } from './refine';
export type { RefineResult, ResolvedConcept, Confidence } from './refine';
export { optimize } from './optimize';
export type { OptimizeOptions, OptimizeResult, OptimizeCandidate, ChosenConcept } from './optimize';
