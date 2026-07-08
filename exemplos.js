#!/usr/bin/env node
/**
 * Exemplos de uso do gerador de sigilos em português
 *
 * Execute com: node exemplos.js
 */

const { sigil } = require('./index');

console.log('='.repeat(60));
console.log('EXEMPLOS DE SIGILOS EM PORTUGUÊS');
console.log('='.repeat(60));
console.log();

// Exemplo 1: Força e coragem
const intencao1 = 'desejo ter força e coragem';
console.log('Intenção:', intencao1);
console.log('Sigilo:  ', sigil(intencao1));
console.log();

// Exemplo 2: Prosperidade
const intencao2 = 'manifesto prosperidade e abundância';
console.log('Intenção:', intencao2);
console.log('Sigilo:  ', sigil(intencao2));
console.log();

// Exemplo 3: Sabedoria
const intencao3 = 'obtenho sabedoria e clareza mental';
console.log('Intenção:', intencao3);
console.log('Sigilo:  ', sigil(intencao3));
console.log();

// Exemplo 4: Amor próprio
const intencao4 = 'conquisto amor próprio e autoconfiança';
console.log('Intenção:', intencao4);
console.log('Sigilo:  ', sigil(intencao4));
console.log();

// Exemplo 5: Sucesso
const intencao5 = 'alcanço sucesso em todos os meus projetos';
console.log('Intenção:', intencao5);
console.log('Sigilo:  ', sigil(intencao5));
console.log();

console.log('='.repeat(60));
console.log('DICAS PARA CRIAR INTENÇÕES EFICAZES');
console.log('='.repeat(60));
console.log();
console.log('✓ Use verbos no presente ou futuro próximo');
console.log('✓ Seja específico sobre o que deseja');
console.log('✓ Evite negações (ao invés de "não medo", use "coragem")');
console.log('✓ Escreva com convicção e clareza');
console.log();
