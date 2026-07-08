export function toUpperCase(label: string): string {
  return label.toUpperCase();
}

const VOWELS = new Set(
  'AEIOUÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÄËÏÖÜ'.split('')
);

export function isVowel(char: string): boolean {
  return VOWELS.has(char);
}
