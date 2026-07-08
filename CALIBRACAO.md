# Calibração dos pesos de força (sem LLM como juiz)

## Por quê

O plano original da Fase 4 previa usar um LLM (local ou via OpenRouter)
como "juiz" para comparar pares de sigilos e ajustar os pesos do score de
força a partir das preferências do modelo. Sem esse setup disponível, a
calibração aqui usa uma fonte de verdade diferente — e, argumentavelmente,
mais defensável: **os próprios princípios documentados da tradição de
sigilização** (Spare, Carroll, Sherwin, Frater U∴D∴ — ver a pesquisa da
Fase 1), formalizados como comparações par-a-par com ordem esperada
inquestionável.

Um LLM julgando "qual sigilo parece mais forte" seria uma opinião —
plausível, mas opaca e não reproduzível. Uma comparação onde a tradição
escrita diz explicitamente "menos formas é melhor" ou "remover vogais
aumenta a abstração" é uma restrição, não uma opinião.

## Metodologia

1. **Bateria de pares** (`src/strength/calibration-battery.ts`): cada par
   `(a, b)` afirma `score(a) >= score(b)` sob um perfil (`grafico` ou
   `mantrico`). Cada par foi construído e depois **verificado
   computacionalmente** — chamando `analyzeSigil()`/`orientedTerms()` nos
   candidatos antes de aceitar o par — para confirmar quais dos 5 termos
   estão empatados (isolamento limpo de uma dimensão) e quais diferem em
   qual direção. Isso evita pares que "parecem" testar uma coisa mas na
   prática são dominados por outra.

2. **Busca de pesos** (`scripts/calibrate-weights.ts`): amostra ~20 mil
   vetores de peso sobre o simplex (5 dimensões, soma 1) e conta quantos
   pares cada vetor satisfaz. Só recomenda trocar os pesos de
   `PROFILE_WEIGHTS` em `score.ts` se encontrar um vetor que satisfaça
   **mais** pares que os atuais — nunca troca só por ter margem maior
   quando os pesos atuais já passam 100%. Margem maior sobre uma bateria
   pequena tende a um canto degenerado do simplex (quase todo peso numa
   única dimensão), o que contradiz o motivo do score ser multi-fator.

3. **Trava em teste** (`test/calibration.test.ts`): a mesma bateria roda
   contra a função `strength()` de produção. Se uma mudança futura em
   `metrics.ts` ou `score.ts` violar algum destes pares, o teste falha —
   a bateria funciona como regressão permanente, não só como exercício
   único.

## Resultado

Rodando `bun run scripts/calibrate-weights.ts`: os pesos atuais (definidos
por julgamento direto ao implementar a Fase 1) **já satisfazem 100% dos 9
pares testados** (7 no perfil gráfico, 2 no mântrico). A calibração
**validou** os pesos existentes em vez de encontrar uma correção — um
resultado honesto e esperável, já que os pesos foram inicialmente
escolhidos seguindo a mesma leitura da tradição que gerou a bateria.

## Lacuna reconhecida

Não há par isolando `strokeCombinability` (combinação de traços) sozinho.
A tradição cita tanto simetria quanto combinação de traços como parte de
"harmonia/estética" (Spare, artista gráfico), sem estabelecer qual pesa
mais. Construir um par de verdade-fundamento aqui seria inventar uma
ordem que a fonte não dá — por isso o peso de `strokeCombinability`
permanece por julgamento direto (0.10, o menor dos cinco), não calibrado.

## Como estender

Para recalibrar após adicionar uma métrica nova ou mudar `metrics.ts`:

```bash
bun run scripts/calibrate-weights.ts
```

Para adicionar um par novo: construa os dois candidatos, rode
`analyzeSigil()`/`orientedTerms()` neles para confirmar isolamento (ou
documentar honestamente que não é isolado, como o par de bigramas),
adicione a `CALIBRATION_PAIRS` em `src/strength/calibration-battery.ts`.
O teste em `test/calibration.test.ts` pega o novo par automaticamente.
