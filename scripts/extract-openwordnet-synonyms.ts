#!/usr/bin/env bun
/**
 * Script de extração ÚNICA (dev-time, não faz parte do pacote publicado).
 *
 * Lê o dump RDF/Turtle own-pt-wordsenses.ttl do OpenWordNet-PT
 * (https://github.com/own-pt/openWordnet-PT, CC-BY-4.0) e extrai um
 * extrato enxuto de sinônimos apenas para as palavras já presentes no
 * léxico curado (src/refine/lexicon.ts), gravando o resultado em
 * src/refine/data/openwordnet-synonyms.json.
 *
 * Uso: bun run scripts/extract-openwordnet-synonyms.ts <caminho-para-own-pt-wordsenses.ttl>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { CONCEPTS } from '../src/refine/lexicon';

const ttlPath = process.argv[2];
if (!ttlPath) {
  console.error('Uso: bun run scripts/extract-openwordnet-synonyms.ts <own-pt-wordsenses.ttl>');
  process.exit(1);
}

const text = readFileSync(ttlPath, 'utf8');
const blocks = text.split('\n\n');

const synsetToWordsenses = new Map<string, string[]>();
const wordsenseToLabel = new Map<string, string>();

for (const block of blocks) {
  const trimmed = block.trim();
  if (!trimmed) continue;

  const containsSubject = trimmed.match(/^own-pt:synset-([\w-]+)\s+owns:containsWordSense/);
  if (containsSubject) {
    const synsetId = containsSubject[1] as string;
    // Só substantivos (synsets terminam em -n/-a/-v/-r): o slot de
    // substituição do template sempre é um substantivo, então descartar
    // synsets de outras classes elimina boa parte do ruído de polissemia
    // (advérbios/verbos com o mesmo synset "vazando" para o substantivo).
    if (!synsetId.endsWith('-n')) continue;
    const ids = [...trimmed.matchAll(/own-pt:wordsense-([\w-]+)/g)].map((m) => m[1] as string);
    synsetToWordsenses.set(synsetId, ids);
    continue;
  }

  const wordsenseSubject = trimmed.match(/^own-pt:wordsense-([\w-]+)\s+a\s+owns:WordSense/);
  if (wordsenseSubject) {
    const labelMatch = trimmed.match(/rdfs:label\s+"([^"]*)"@pt/);
    if (labelMatch) {
      wordsenseToLabel.set(wordsenseSubject[1] as string, (labelMatch[1] as string).toLowerCase());
    }
  }
}

console.error(`synsets: ${synsetToWordsenses.size}, wordsenses rotulados: ${wordsenseToLabel.size}`);

const labelToSynonyms = new Map<string, Set<string>>();

for (const wsIds of synsetToWordsenses.values()) {
  const labels = [...new Set(wsIds.map((id) => wordsenseToLabel.get(id)).filter((l): l is string => !!l))];
  if (labels.length < 2) continue;

  for (const label of labels) {
    if (!labelToSynonyms.has(label)) labelToSynonyms.set(label, new Set());
    const set = labelToSynonyms.get(label) as Set<string>;
    for (const other of labels) {
      if (other !== label) set.add(other);
    }
  }
}

const SINGLE_WORD_PT = /^[a-zà-öø-ÿ]+$/i;
const MAX_SYNONYMS_PER_WORD = 12;

const seedWords = new Set<string>();
for (const concept of CONCEPTS) {
  seedWords.add(concept.lemma.toLowerCase());
  for (const form of [...concept.positiveSurfaceForms, ...concept.negativeSurfaceForms]) {
    if (SINGLE_WORD_PT.test(form)) seedWords.add(form.toLowerCase());
  }
}

const output: Record<string, string[]> = {};

for (const seed of seedWords) {
  const synonyms = labelToSynonyms.get(seed);
  if (!synonyms) continue;

  const filtered = [...synonyms]
    .filter((s) => SINGLE_WORD_PT.test(s) && s !== seed)
    .sort()
    .slice(0, MAX_SYNONYMS_PER_WORD);

  if (filtered.length > 0) output[seed] = filtered;
}

const outPath = new URL('../src/refine/data/openwordnet-synonyms.json', import.meta.url);
writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');
console.error(`Extraídas ${Object.keys(output).length} entradas -> ${outPath.pathname}`);
