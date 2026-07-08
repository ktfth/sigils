export type Gender = 'f' | 'm';
export type Category =
  | 'virtude'
  | 'recurso'
  | 'sentimento'
  | 'resultado'
  | 'saude'
  | 'habilidade'
  | 'relacao';

export interface ConceptDefinition {
  /** Forma canônica usada na saída composta (ex.: "coragem"). */
  lemma: string;
  gender: Gender;
  category: Category;
  /** Formas de superfície que, quando mencionadas diretamente, apontam para este conceito. */
  positiveSurfaceForms: string[];
  /** Formas de superfície que representam o estado indesejado oposto. */
  negativeSurfaceForms: string[];
}

/**
 * Léxico curado à mão (não deriva de OpenWordNet-PT/TeP — isso é Fase 3).
 * Cobre os temas mais comuns em intenções de magia do caos. Extensível:
 * adicionar um par positivo/negativo não exige mudança de código.
 */
export const CONCEPTS: readonly ConceptDefinition[] = [
  {
    lemma: 'coragem',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['coragem', 'corajoso', 'corajosa', 'destemor', 'destemido', 'destemida', 'valentia', 'bravura'],
    negativeSurfaceForms: ['medo', 'medos', 'covardia', 'pavor'],
  },
  {
    lemma: 'sabedoria',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['sabedoria', 'sábio', 'sábia', 'sapiência'],
    negativeSurfaceForms: ['ignorância', 'ignorancia', 'burrice'],
  },
  {
    lemma: 'clareza',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['clareza', 'claro', 'clara', 'lucidez'],
    negativeSurfaceForms: ['confusão', 'confusao', 'dúvida', 'duvida'],
  },
  {
    lemma: 'confiança',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['confiança', 'confianca', 'confiante'],
    negativeSurfaceForms: ['insegurança', 'inseguranca', 'timidez', 'inseguro', 'insegura'],
  },
  {
    lemma: 'disciplina',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['disciplina', 'disciplinado', 'disciplinada', 'foco', 'focado', 'focada'],
    negativeSurfaceForms: ['procrastinação', 'procrastinacao', 'preguiça', 'preguica'],
  },
  {
    lemma: 'paz',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['paz', 'tranquilo', 'tranquila', 'sereno', 'serena'],
    negativeSurfaceForms: ['raiva', 'conflito', 'briga', 'ira'],
  },
  {
    lemma: 'calma',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['calma', 'calmo'],
    negativeSurfaceForms: ['ansiedade', 'estresse', 'nervosismo', 'agonia'],
  },
  {
    lemma: 'gratidão',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['gratidão', 'gratidao', 'grato', 'grata'],
    negativeSurfaceForms: ['negatividade', 'ingratidão', 'ingratidao'],
  },
  {
    lemma: 'força',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['força', 'forca', 'forte', 'fortaleza'],
    negativeSurfaceForms: ['fraqueza', 'fraco', 'fraca'],
  },
  {
    lemma: 'abundância',
    gender: 'f',
    category: 'recurso',
    positiveSurfaceForms: [
      'abundância',
      'abundancia',
      'prosperidade',
      'riqueza',
      'fartura',
      'dinheiro',
    ],
    negativeSurfaceForms: ['escassez', 'pobreza', 'carência', 'carencia'],
  },
  {
    lemma: 'alegria',
    gender: 'f',
    category: 'sentimento',
    positiveSurfaceForms: ['alegria', 'feliz', 'felicidade', 'contentamento'],
    negativeSurfaceForms: ['tristeza', 'infelicidade', 'melancolia'],
  },
  {
    lemma: 'tranquilidade',
    gender: 'f',
    category: 'sentimento',
    positiveSurfaceForms: ['tranquilidade', 'serenidade'],
    negativeSurfaceForms: ['agitação', 'agitacao', 'aflição', 'aflicao'],
  },
  {
    lemma: 'amor',
    gender: 'm',
    category: 'relacao',
    positiveSurfaceForms: ['amor', 'amoroso', 'amorosa'],
    negativeSurfaceForms: ['solidão', 'solidao', 'ódio', 'odio'],
  },
  {
    lemma: 'sucesso',
    gender: 'm',
    category: 'resultado',
    positiveSurfaceForms: ['sucesso', 'êxito', 'exito', 'vitória', 'vitoria', 'realização', 'realizacao'],
    negativeSurfaceForms: ['fracasso', 'derrota', 'insucesso'],
  },
  {
    lemma: 'saúde',
    gender: 'f',
    category: 'saude',
    positiveSurfaceForms: ['saúde', 'saude', 'saudável', 'saudavel'],
    negativeSurfaceForms: ['doença', 'doenca', 'enfermidade'],
  },
  {
    lemma: 'vitalidade',
    gender: 'f',
    category: 'saude',
    positiveSurfaceForms: ['vitalidade', 'energia', 'disposição', 'disposicao', 'vigor'],
    negativeSurfaceForms: ['cansaço', 'cansaco', 'cansado', 'cansada', 'exaustão', 'exaustao', 'letargia'],
  },
  {
    lemma: 'excelência',
    gender: 'f',
    category: 'habilidade',
    positiveSurfaceForms: ['excelência', 'excelencia', 'competência', 'competencia', 'maestria'],
    negativeSurfaceForms: ['mediocridade', 'incompetência', 'incompetencia'],
  },
  {
    lemma: 'criatividade',
    gender: 'f',
    category: 'habilidade',
    positiveSurfaceForms: ['criatividade', 'criativo', 'criativa', 'inspiração', 'inspiracao'],
    negativeSurfaceForms: ['bloqueio'],
  },
  {
    lemma: 'conexão',
    gender: 'f',
    category: 'relacao',
    positiveSurfaceForms: ['conexão', 'conexao', 'pertencimento'],
    negativeSurfaceForms: ['isolamento', 'exclusão', 'exclusao'],
  },
  {
    lemma: 'harmonia',
    gender: 'f',
    category: 'relacao',
    positiveSurfaceForms: ['harmonia', 'equilíbrio', 'equilibrio'],
    negativeSurfaceForms: ['discórdia', 'discordia', 'caos'],
  },
  {
    lemma: 'autoestima',
    gender: 'f',
    category: 'virtude',
    positiveSurfaceForms: ['autoestima', 'amor próprio', 'autoconfiança', 'autoconfianca'],
    negativeSurfaceForms: ['autodepreciação', 'autodepreciacao'],
  },
];

function buildIndex(pick: (c: ConceptDefinition) => string[]): Map<string, ConceptDefinition> {
  const index = new Map<string, ConceptDefinition>();

  for (const concept of CONCEPTS) {
    for (const form of pick(concept)) {
      if (index.has(form)) {
        throw new Error(`Léxico inconsistente: forma de superfície duplicada "${form}"`);
      }
      index.set(form, concept);
    }
  }

  return index;
}

export const POSITIVE_SURFACE_INDEX = buildIndex((c) => c.positiveSurfaceForms);
export const NEGATIVE_SURFACE_INDEX = buildIndex((c) => c.negativeSurfaceForms);

for (const key of POSITIVE_SURFACE_INDEX.keys()) {
  if (NEGATIVE_SURFACE_INDEX.has(key)) {
    throw new Error(`Léxico inconsistente: "${key}" é positivo e negativo ao mesmo tempo`);
  }
}

/** Maior número de tokens usado por alguma forma de superfície (para matching guloso). */
export const MAX_SURFACE_FORM_TOKENS = Math.max(
  ...CONCEPTS.flatMap((c) => [...c.positiveSurfaceForms, ...c.negativeSurfaceForms]).map(
    (form) => form.split(' ').length
  )
);
