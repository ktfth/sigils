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

```bash
sigils 'desejo ter força e coragem'
```

### Como módulo JavaScript

```javascript
const sigils = require('sigils');

const meuSigilo = sigils.sigil('desejo ter força e coragem');
console.log(meuSigilo);
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

---

**Nota:** Este é um projeto educacional sobre técnicas de magia do caos e processamento de texto.
