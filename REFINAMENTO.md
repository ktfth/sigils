# Refinamento de Intenções com IA

## Visão Geral

O módulo de refinamento utiliza o OpenRouter para transformar intenções vagas, ambíguas ou mal formuladas em declarações precisas, diretas e em linguagem culta portuguesa.

## Por que Refinar?

Na magia do caos, a precisão da intenção é fundamental. Uma intenção mal formulada pode:

- Conter **ambiguidades** que levam a resultados indesejados
- Ter **duplo sentido** ou interpretações múltiplas
- Focar no **problema** ao invés da solução
- Usar **negações** que confundem o subconsciente
- Ser **vaga demais** para ter impacto real

### Exemplos de Problemas Comuns

| Intenção Problemática | Problema | Solução |
|----------------------|----------|---------|
| "Quero não ter medo" | Negação - foca no medo | "Manifesto coragem plena" |
| "Preciso de dinheiro" | Vaga - quanto? para quê? | "Atraio abundância financeira suficiente" |
| "Quero ser feliz" | Abstrata demais | "Experimento alegria genuína diariamente" |
| "Desejo melhorar" | Sem especificidade | "Desenvolvo excelência em [área específica]" |

## Como Funciona

O refinamento segue estes princípios:

### 1. Eliminação de Negações
```
Antes: "não quero estar doente"
Depois: "Manifesto saúde plena e vitalidade"
```

### 2. Adição de Especificidade
```
Antes: "quero sucesso"
Depois: "Alcanço êxito notável em meus empreendimentos profissionais"
```

### 3. Linguagem Culta e Precisa
```
Antes: "quero ficar rico"
Depois: "Conquisto prosperidade material abundante"
```

### 4. Tempo Verbal Adequado
```
Antes: "vou ter coragem"
Depois: "Possuo coragem inabalável" (presente)
```

### 5. Foco no Resultado Positivo
```
Antes: "quero sair da pobreza"
Depois: "Ascendo à abundância financeira"
```

## Uso Técnico

### CLI (Linha de Comando)

```bash
# Configurar API Key
export OPENROUTER_API_KEY="sk-or-v1-sua-chave"

# Refinar intenção
sigils "minha intenção vaga" --refinar
```

### Módulo JavaScript

```javascript
const { refinarIntencao } = require('sigils/refinar');

async function exemplo() {
  const intencaoOriginal = "quero não ter medo";
  const apiKey = process.env.OPENROUTER_API_KEY;

  const refinada = await refinarIntencao(intencaoOriginal, apiKey);
  console.log(refinada);
  // "Manifesto coragem plena e inabalável"
}
```

### Parâmetros Avançados

```javascript
// Usar modelo diferente
const refinada = await refinarIntencao(
  intencaoOriginal,
  apiKey,
  'anthropic/claude-3-haiku' // Mais rápido e barato
);
```

## Modelos Recomendados

| Modelo | Qualidade | Velocidade | Custo | Uso Recomendado |
|--------|-----------|------------|-------|-----------------|
| `anthropic/claude-3.5-sonnet` | ⭐⭐⭐⭐⭐ | Média | Médio | Padrão - melhor qualidade |
| `anthropic/claude-3-haiku` | ⭐⭐⭐⭐ | Rápida | Baixo | Refinamento rápido |
| `openai/gpt-4o` | ⭐⭐⭐⭐ | Média | Médio | Alternativa ao Claude |
| `meta-llama/llama-3.1-70b` | ⭐⭐⭐ | Rápida | Baixo | Opção econômica |

## Custos

O refinamento via OpenRouter tem custo mínimo:

- **Claude 3.5 Sonnet**: ~$0.003-0.015 por refinamento
- **Claude 3 Haiku**: ~$0.0004-0.0012 por refinamento
- **GPT-4o**: ~$0.0025-0.01 por refinamento

100 refinamentos custam tipicamente menos de $1 USD.

## Privacidade e Segurança

⚠️ **Importante**: Suas intenções são enviadas ao OpenRouter/provedor do modelo.

- Não use para informações extremamente sensíveis
- O OpenRouter não armazena as requisições por padrão
- Use sua própria API key (não compartilhe)
- Configure políticas de privacidade no dashboard do OpenRouter

## Troubleshooting

### Erro: "API Key não fornecida"
```bash
export OPENROUTER_API_KEY="sk-or-v1-sua-chave"
```

### Erro: "OpenRouter retornou erro 401"
- Verifique se sua API key está correta
- Confirme que sua conta tem créditos

### Erro: "OpenRouter retornou erro 429"
- Você excedeu o rate limit
- Aguarde alguns segundos entre requisições

### Refinamento genérico demais
- O modelo usado pode não ser ideal
- Tente `anthropic/claude-3.5-sonnet` para melhor qualidade

## Exemplos Práticos

Execute o arquivo de demonstração:

```bash
node exemplo-refinamento.js
```

Este script mostra transformações de várias intenções vagas em precisas.

## Filosofia

O refinamento não substitui sua criatividade ou intuição. Ele serve como:

1. **Ferramenta de clareza** - Ajuda a ver brechas na formulação
2. **Guia linguístico** - Oferece vocabulário mais preciso
3. **Verificação de lógica** - Identifica negações e ambiguidades

A intenção final ainda deve ressoar com você. Se o refinamento não parecer certo, ajuste manualmente ou reformule a intenção original.

---

**Lembre-se**: Uma flecha bem apontada atinge o alvo. Uma intenção bem formulada manifesta o desejo.
