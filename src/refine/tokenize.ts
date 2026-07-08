/**
 * Tokeniza uma intenção em palavras minúsculas, sem pontuação. Acentos são
 * preservados porque o léxico (lexicon.ts) é indexado com acentuação.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[.,;:!?()"'`]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 0);
}
