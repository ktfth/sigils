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

#### Refinamento de intenção com IA (OpenRouter)

Para eliminar ambiguidades e criar intenções precisas em linguagem culta:

```bash
# Configure sua API key do OpenRouter
export OPENROUTER_API_KEY="sk-or-v1-sua-chave-aqui"

# Refine a intenção antes de gerar o sigilo
sigils 'quero ser forte' --refinar
```

A opção `--refinar` (ou `--polish`) utiliza IA para:
- Transformar intenções vagas em declarações precisas
- Eliminar ambiguidades e brechas interpretativas
- Converter para linguagem culta portuguesa
- Formular no tempo verbal adequado
- Remover negações e focar no positivo

**Exemplo de refinamento:**
```bash
# Intenção vaga
$ sigils 'quero não ter medo' --refinar

Intenção original: quero não ter medo
Refinando intenção...

Intenção refinada: Manifesto coragem plena e inabalável em todas as situações
Sigilo: MANIFESTO C-R-G-M PL--A - I--B-L-V-- -M T-D-- A- -I-U-ÇÕ--
```

### Como módulo JavaScript

```javascript
const sigils = require('sigils');
const { refinarIntencao, obterApiKey } = require('sigils/refinar');

// Uso básico
const meuSigilo = sigils.sigil('desejo ter força e coragem');
console.log(meuSigilo);

// Com refinamento
const apiKey = obterApiKey(); // ou forneça diretamente
refinarIntencao('quero ser forte', apiKey)
  .then(intencaoRefinada => {
    console.log('Refinada:', intencaoRefinada);
    console.log('Sigilo:', sigils.sigil(intencaoRefinada));
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
