/**
 * Módulo para refinar intenções usando OpenRouter
 *
 * Utiliza IA para transformar intenções vagas ou ambíguas em declarações
 * precisas, diretas e em linguagem culta, eliminando brechas interpretativas.
 */

const https = require('https');

/**
 * Refina uma intenção usando o OpenRouter
 *
 * @param {string} intencao - A intenção original a ser refinada
 * @param {string} apiKey - Chave da API do OpenRouter
 * @param {string} modelo - Modelo a ser usado (padrão: anthropic/claude-3.5-sonnet)
 * @returns {Promise<string>} A intenção refinada
 */
async function refinarIntencao(intencao, apiKey, modelo = 'anthropic/claude-3.5-sonnet') {
  if (!apiKey) {
    throw new Error('API Key do OpenRouter não fornecida. Configure OPENROUTER_API_KEY');
  }

  const prompt = `Você é um especialista em magia do caos e formulação de intenções precisas.

Sua tarefa é refinar a seguinte intenção para torná-la:
- Clara e sem ambiguidades
- Direta e objetiva como uma flecha
- Em linguagem culta portuguesa
- Sem brechas para interpretações indesejadas
- Focada no resultado positivo desejado
- Formulada no presente ou futuro próximo
- Sem negações (use afirmações positivas)

Intenção original: "${intencao}"

Retorne APENAS a intenção refinada, sem explicações adicionais.`;

  const payload = JSON.stringify({
    model: modelo,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 200
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'HTTP-Referer': 'https://github.com/ktfth/sigils',
        'X-Title': 'Sigils - Gerador de Sigilos'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`OpenRouter retornou erro ${res.statusCode}: ${data}`));
            return;
          }

          const response = JSON.parse(data);
          const intencaoRefinada = response.choices[0].message.content.trim();
          resolve(intencaoRefinada);
        } catch (error) {
          reject(new Error(`Erro ao processar resposta: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Erro na requisição: ${error.message}`));
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Obtém a API Key do OpenRouter das variáveis de ambiente
 *
 * @returns {string|null} A API Key ou null se não encontrada
 */
function obterApiKey() {
  return process.env.OPENROUTER_API_KEY || null;
}

module.exports = {
  refinarIntencao,
  obterApiKey
};
