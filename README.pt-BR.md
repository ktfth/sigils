# Sigils - Gerador de Sigilos

## O que é um Sigilo?

Um sigilo é a transformação de uma intenção em um símbolo único, eliminando repetições de letras. Esta técnica vem da magia do caos e serve para criar representações visuais concentradas de desejos ou objetivos.

## Como Funciona

O algoritmo segue um processo direto:

1. **Sua intenção é convertida para maiúsculas**
2. **Cada letra aparece apenas uma vez** - repetições são substituídas por traços (-)
3. **O resultado é um padrão único** que representa sua intenção

### Exemplo Prático

**Intenção:** "desejo ter força e coragem"

**Processo:**
- D E S E J O   T E R   F O R Ç A   E   C O R A G E M
- D E S -desejo- J O   T -ter- R   F -força- R Ç A   -e-   C -coragem- R A G -e- M

**Sigilo:** `DESJO T-R FORÇA - C-RAG-M`

## Instalação

### Como ferramenta global (CLI)

```bash
[sudo] npm i -g sigils
```

### Como módulo no seu projeto

```bash
npm i sigils
```

## Uso

### Pela linha de comando

#### Uso básico

```bash
sigils 'desejo ter força e coragem'
```

#### Refinamento de intenção (100% offline, sem IA)

Para eliminar ambiguidades e criar intenções precisas em linguagem culta:

```bash
sigils 'quero não ter medo' --refinar
```

A opção `--refinar` (ou `--polish`) usa um léxico curado + regras determinísticas — sem rede, sem chave de API — para:
- Detectar negações ("não", "sem", "nunca"...) e resolvê-las para o antônimo positivo
- Reconhecer o conceito-núcleo da intenção (léxico de ~20 pares positivo/negativo)
- Compor a frase no presente, em linguagem culta, com concordância de gênero automática
- Focar no resultado positivo, sem negações

**Exemplo:**
```bash
$ sigils 'quero não ter medo' --refinar

Intenção original: quero não ter medo
Intenção refinada: Manifesto coragem plena e inabalável (confiança: alta)

Sigilo: MANIFESTO C-R-G-- PL--- - ---B--ÁV--
```

Use `--explain` para ver quais conceitos foram reconhecidos e o nível de confiança do refino.

#### Otimização lexical (busca o sigilo mais forte)

```bash
sigils 'quero não ter medo' --otimizar --explain
```

A opção `--otimizar` refina a intenção e depois busca — entre sinônimos reais
extraídos do [OpenWordNet-PT](https://github.com/own-pt/openWordnet-PT) (CC
BY 4.0) e as duas variantes de vogais — a combinação que maximiza a força do
sigilo (métricas da Fase 1), sempre preservando a concordância de gênero.
`--explain` mostra quais sinônimos foram escolhidos e as alternativas
consideradas.

#### Outras opções do CLI

```bash
sigils 'desejo ter força e coragem' --score       # mostra a força do sigilo (0 a 1)
sigils 'desejo ter força e coragem' --explain     # detalha a força por métrica
sigils 'desejo ter força e coragem' --mantrico    # perfil de força para sigilos sonoros
sigils 'desejo ter força e coragem' --sem-vogais  # variante Carroll/Sherwin (remove vogais)
```

#### Refinamento via IA (OpenRouter, legado/opcional)

Se preferir usar um LLM externo em vez do motor offline:

```bash
export OPENROUTER_API_KEY="sk-or-v1-sua-chave-aqui"
sigils 'quero ser forte' --refinar-llm
```

### Como módulo JavaScript/TypeScript

```javascript
const { sigil, refine, strength, optimize } = require('sigils');

// Uso básico
const meuSigilo = sigil('desejo ter força e coragem');
console.log(meuSigilo);

// Refinamento offline (sem rede, sem IA)
const resultado = refine('quero não ter medo');
console.log('Refinada:', resultado.refined);   // "Manifesto coragem plena e inabalável"
console.log('Confiança:', resultado.confidence); // "alta" | "media" | "baixa"
console.log('Sigilo:', sigil(resultado.refined));

// Força do sigilo (0 a 1, perfis "grafico" ou "mantrico")
console.log(strength(sigil(resultado.refined)).score);

// Otimização: busca o sinônimo (OpenWordNet-PT) e a variante de vogais
// que maximizam a força do sigilo
const otimizado = optimize('quero não ter medo');
console.log(otimizado.best.refined, otimizado.best.sigilo, otimizado.best.score);
```

Refinamento via LLM externo (legado, opcional):

```javascript
const { refinarIntencao, obterApiKey } = require('sigils/refinar');

const apiKey = obterApiKey(); // ou forneça diretamente
refinarIntencao('quero ser forte', apiKey)
  .then(intencaoRefinada => {
    console.log('Refinada:', intencaoRefinada);
  });
```

## Propósito

Esta ferramenta transforma intenções em padrões visuais únicos. O processo de remoção de repetições cria uma "assinatura" distintiva de cada frase, útil para:

- Práticas de foco e manifestação
- Criação de símbolos pessoais
- Arte generativa baseada em texto
- Estudos de magia do caos

## Clareza de Intenção

Para melhores resultados:
- **Seja específico**: "desejo coragem para falar em público"
- **Use verbos claros**: "obtenho", "conquisto", "manifesto"
- **Evite negações**: ao invés de "não quero medo", use "desejo coragem"
- **Presente ou futuro próximo**: escreva como se já estivesse acontecendo

## Configuração do OpenRouter

Para usar o refinamento de intenções com IA:

1. **Crie uma conta no OpenRouter**: https://openrouter.ai/
2. **Obtenha sua API Key**: Acesse https://openrouter.ai/keys
3. **Configure a variável de ambiente**:
   ```bash
   export OPENROUTER_API_KEY="sk-or-v1-sua-chave-aqui"
   ```
4. **Adicione créditos**: O OpenRouter opera com pagamento por uso

**Modelos recomendados:**
- `anthropic/claude-3.5-sonnet` (padrão) - Melhor qualidade
- `anthropic/claude-3-haiku` - Mais rápido e econômico
- `openai/gpt-4o` - Alternativa com boa qualidade

O custo por refinamento é tipicamente menor que $0.01 USD.

---

**Nota:** Este é um projeto educacional sobre técnicas de magia do caos e processamento de texto.
