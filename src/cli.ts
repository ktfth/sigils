#!/usr/bin/env node
import { sigil, strength, refine, optimize, type Profile } from './index';

interface RefinarLegacyModule {
  refinarIntencao: (intencao: string, apiKey: string, modelo?: string) => Promise<string>;
  obterApiKey: () => string | null;
}

// Import dinâmico e não-tipado de propósito: refinar.js vive na raiz do pacote
// (fora de src/) para permanecer requerível como `sigils/refinar` (ver README).
// Caminho legado, mantido apenas atrás de --refinar-llm.
const { refinarIntencao, obterApiKey } = require('../refinar.js') as RefinarLegacyModule;

function printScore(sigiloText: string, profile: Profile, explain: boolean): void {
  const result = strength(sigiloText, profile);
  console.log(`\nForça (${profile}): ${result.score.toFixed(3)}`);

  if (!explain) return;

  console.log('\nDetalhamento:');
  for (const term of result.breakdown) {
    console.log(
      `  ${term.label.padEnd(28)} raw=${term.raw.toFixed(2)}  orientado=${term.oriented.toFixed(2)}  peso=${term.weight.toFixed(2)}  contribuição=${term.contribution.toFixed(3)}`
    );
  }
}

function printUsageAndExit(): never {
  console.error('Uso: sigils "sua intenção" [opções]');
  console.error('\nOpções:');
  console.error('  --refinar, --polish      Refina a intenção offline (léxico + regras, sem rede)');
  console.error('  --otimizar               Refina e busca o sinônimo/variante que maximiza a força');
  console.error('  --refinar-llm            Refina via OpenRouter (legado, requer OPENROUTER_API_KEY)');
  console.error('  --sem-vogais             Remove vogais antes de deduplicar (variante Carroll/Sherwin)');
  console.error('  --score                  Mostra a força do sigilo (0 a 1)');
  console.error('  --explain                Mostra o detalhamento da força e do refino por métrica');
  console.error('  --mantrico               Usa o perfil de força para sigilos sonoros (mântricos)');
  console.error('\nVariáveis de ambiente:');
  console.error('  OPENROUTER_API_KEY       Chave da API do OpenRouter (obrigatória para --refinar-llm)');
  process.exit(1);
}

function main(): void {
  const args = process.argv.slice(2);
  const refinarOffline = args.includes('--refinar') || args.includes('--polish');
  const otimizar = args.includes('--otimizar');
  const refinarLlm = args.includes('--refinar-llm') || args.includes('--polish-llm');
  const semVogais = args.includes('--sem-vogais');
  const explain = args.includes('--explain');
  const mostrarScore = explain || args.includes('--score');
  const profile: Profile = args.includes('--mantrico') ? 'mantrico' : 'grafico';
  const intencaoOriginal = args.find((arg) => !arg.startsWith('--'));

  if (!intencaoOriginal) {
    printUsageAndExit();
  }

  const sigilOptions = semVogais ? ({ vowels: 'remove' } as const) : undefined;

  if (refinarLlm) {
    const apiKey = obterApiKey();

    if (!apiKey) {
      console.error('Erro: Para usar --refinar-llm, configure a variável OPENROUTER_API_KEY');
      console.error('Exemplo: export OPENROUTER_API_KEY="sk-or-v1-..."');
      process.exit(1);
    }

    console.log('Intenção original:', intencaoOriginal);
    console.log('\nRefinando intenção via OpenRouter...\n');

    refinarIntencao(intencaoOriginal, apiKey)
      .then((intencaoRefinada) => {
        const sigiloText = sigil(intencaoRefinada, sigilOptions);
        console.log('Intenção refinada:', intencaoRefinada);
        console.log('\nSigilo:', sigiloText);
        if (mostrarScore) printScore(sigiloText, profile, explain);
      })
      .catch((error: Error) => {
        console.error('Erro ao refinar intenção:', error.message);
        console.error('\nUsando intenção original...');
        const sigiloText = sigil(intencaoOriginal, sigilOptions);
        console.log('Sigilo:', sigiloText);
        if (mostrarScore) printScore(sigiloText, profile, explain);
      });
    return;
  }

  if (otimizar) {
    const resultado = optimize(intencaoOriginal, { profile });

    console.log('Intenção original:', intencaoOriginal);
    console.log('Intenção otimizada:', resultado.best.refined);
    console.log(
      `\nSigilo: ${resultado.best.sigilo} (vogais: ${resultado.best.vowels === 'remove' ? 'removidas' : 'mantidas'})`
    );
    console.log(
      `Força (${profile}): ${resultado.best.score.toFixed(3)} [${resultado.strategy}, ${resultado.combinationsEvaluated} combinações avaliadas]`
    );

    if (explain) {
      if (resultado.best.chosen.length > 0) {
        console.log('\nEscolhas lexicais:');
        for (const c of resultado.best.chosen) {
          console.log(
            `  ${c.lemma}${c.lemma !== c.original ? ` — sinônimo de "${c.original}" (OpenWordNet-PT)` : ' (original)'}`
          );
        }
      }
      if (resultado.alternatives.length > 0) {
        console.log('\nAlternativas consideradas:');
        for (const alt of resultado.alternatives) {
          console.log(`  ${alt.refined} -> ${alt.sigilo} (força: ${alt.score.toFixed(3)})`);
        }
      }
    }
    return;
  }

  if (refinarOffline) {
    const resultado = refine(intencaoOriginal);
    const sigiloText = sigil(resultado.refined, sigilOptions);

    console.log('Intenção original:', intencaoOriginal);
    console.log('Intenção refinada:', resultado.refined, `(confiança: ${resultado.confidence})`);
    console.log('\nSigilo:', sigiloText);

    if (explain) {
      if (resultado.concepts.length > 0) {
        console.log('\nConceitos reconhecidos:');
        for (const c of resultado.concepts) {
          const flags = [c.wasNegated && 'negação resolvida', c.wasFuzzy && 'correção aproximada']
            .filter(Boolean)
            .join(', ');
          console.log(`  ${c.lemma} (${c.gender}, ${c.category})${flags ? ` — ${flags}` : ''}`);
        }
      }
      if (resultado.warnings.length > 0) {
        console.log('\nAvisos:');
        for (const w of resultado.warnings) console.log(`  ${w}`);
      }
    }

    if (mostrarScore) printScore(sigiloText, profile, explain);
    return;
  }

  const sigiloText = sigil(intencaoOriginal, sigilOptions);
  console.log(sigiloText);
  if (mostrarScore) printScore(sigiloText, profile, explain);
}

main();
