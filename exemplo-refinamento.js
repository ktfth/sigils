#!/usr/bin/env node
/**
 * Exemplo de uso do refinamento de intenções com OpenRouter
 *
 * Este exemplo demonstra como intenções vagas ou ambíguas podem ser
 * transformadas em declarações precisas e diretas usando IA.
 *
 * Uso: node exemplo-refinamento.js
 * Requer: OPENROUTER_API_KEY configurada
 */

const { sigil } = require('./sigils');
const { refinarIntencao, obterApiKey } = require('./refinar');

// Exemplos de intenções que precisam de refinamento
const intencoesVagas = [
  'quero não ter medo',
  'preciso de dinheiro',
  'quero ser feliz',
  'desejo melhorar minha vida',
  'quero ter sucesso'
];

async function demonstrarRefinamento() {
  const apiKey = obterApiKey();

  if (!apiKey) {
    console.error('Erro: Configure a variável OPENROUTER_API_KEY');
    console.error('Exemplo: export OPENROUTER_API_KEY="sk-or-v1-..."');
    console.error('\nObtenha sua chave em: https://openrouter.ai/keys');
    process.exit(1);
  }

  console.log('='.repeat(70));
  console.log('DEMONSTRAÇÃO DE REFINAMENTO DE INTENÇÕES');
  console.log('='.repeat(70));
  console.log();

  for (const intencaoVaga of intencoesVagas) {
    console.log('─'.repeat(70));
    console.log(`Intenção vaga: "${intencaoVaga}"`);
    console.log();

    try {
      // Refina a intenção
      const intencaoRefinada = await refinarIntencao(intencaoVaga, apiKey);

      console.log(`✓ Refinada: "${intencaoRefinada}"`);
      console.log();

      // Gera sigilos para comparação
      const sigiloVago = sigil(intencaoVaga);
      const sigiloRefinado = sigil(intencaoRefinada);

      console.log('Sigilo da intenção vaga:');
      console.log(`  ${sigiloVago}`);
      console.log();
      console.log('Sigilo da intenção refinada:');
      console.log(`  ${sigiloRefinado}`);
      console.log();

    } catch (error) {
      console.error(`✗ Erro ao refinar: ${error.message}`);
      console.log();
    }

    // Pequena pausa entre requisições
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('='.repeat(70));
  console.log('BENEFÍCIOS DO REFINAMENTO');
  console.log('='.repeat(70));
  console.log();
  console.log('✓ Elimina ambiguidades e duplo sentido');
  console.log('✓ Converte negações em afirmações positivas');
  console.log('✓ Adiciona especificidade e clareza');
  console.log('✓ Utiliza linguagem culta e precisa');
  console.log('✓ Remove brechas interpretativas');
  console.log('✓ Foca no resultado desejado, não no problema');
  console.log();
}

// Executa a demonstração
demonstrarRefinamento().catch(error => {
  console.error('Erro:', error.message);
  process.exit(1);
});
