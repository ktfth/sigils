import { describe, expect, test } from 'bun:test';
import { sigil } from '../src/core/sigil';
import { toUpperCase } from '../src/core/normalize';

describe('toUpperCase', () => {
  test('converte para maiúsculas', () => {
    expect(toUpperCase('this')).toBe('THIS');
  });
});

describe('sigil (comportamento histórico, vowels: keep)', () => {
  test('exemplo original em inglês', () => {
    expect(sigil('this my wish to obtain the strength of a tiger')).toBe(
      'THIS MY W--- -O -B-A-N --E --R--G-- -F - -----'
    );
  });

  test('intenção em português com força e coragem', () => {
    expect(sigil('desejo ter força e coragem')).toBe('DES-JO T-R F--ÇA - C---G-M');
  });

  test('intenção de prosperidade com acentuação', () => {
    expect(sigil('manifesto prosperidade e abundância')).toBe(
      'MANIFESTO PR------D--- - -BU--Â-C--'
    );
  });

  test('intenção de sabedoria e clareza mental', () => {
    expect(sigil('obtenho sabedoria e clareza mental')).toBe(
      'OBTENH- SA--D-RI- - CL---Z- M-----'
    );
  });

  test('string vazia retorna string vazia', () => {
    expect(sigil('')).toBe('');
  });
});

describe('sigil (variante vowels: remove)', () => {
  test('remove vogais antes de deduplicar consoantes', () => {
    expect(sigil('desejo ter força e coragem', { vowels: 'remove' })).toBe('DSJ TR F-Ç  C-GM');
  });

  test('remove vogais acentuadas também', () => {
    expect(sigil('manifesto prosperidade e abundância', { vowels: 'remove' })).toBe(
      'MNFST PR---D-  B---C'
    );
  });

  test('exemplo original em inglês sem vogais', () => {
    expect(sigil('this my wish to obtain the strength of a tiger', { vowels: 'remove' })).toBe(
      'THS MY W-- - B-N -- --R-G-- F  ---'
    );
  });
});
