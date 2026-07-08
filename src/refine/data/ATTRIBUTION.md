# Atribuição de dados — openwordnet-synonyms.json

Este arquivo contém um extrato enxuto derivado do **OpenWordNet-PT**:

- Fonte: https://github.com/own-pt/openWordnet-PT
- Licença dos dados: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Arquivo de origem: `data/own-pt-wordsenses.ttl` (RDF/Turtle)

## Como foi extraído

`scripts/extract-openwordnet-synonyms.ts` faz o parsing do dump RDF,
restringe a synsets de substantivo (sufixo `-n`) e mantém apenas as
palavras que já existem no léxico curado (`src/refine/lexicon.ts`) — um
extrato de ~90 entradas, não o dataset completo (~65 MB).

## Curadoria adicional

`src/optimize/synonyms.ts` aplica um `SENSE_BLOCKLIST` sobre este extrato:
o OpenWordNet-PT não desambigua sentido, então um synset de substantivo às
vezes agrupa acepções distantes da intenção de uso aqui (ex.: "força"
também aparece associado a "violência" em outro synset). O bloqueio foi
definido por revisão manual do extrato completo, não por regra automática.

## Licença deste pacote

O código deste repositório é licenciado sob ISC (ver `package.json`). O
arquivo `openwordnet-synonyms.json` permanece sob CC BY 4.0 — atribuição
ao projeto OpenWordNet-PT conforme exigido pela licença.
