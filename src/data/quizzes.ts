export type QuestionType = 'multiple_choice' | 'true_false' | 'order'

export interface MCQuestion {
  id: string
  type: 'multiple_choice'
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export interface TFQuestion {
  id: string
  type: 'true_false'
  prompt: string
  answer: boolean
  explanation: string
}

export interface OrderQuestion {
  id: string
  type: 'order'
  prompt: string
  items: string[]
  explanation: string
}

export type Question = MCQuestion | TFQuestion | OrderQuestion

export interface Quiz {
  id: string
  sectionId: string
  questions: Question[]
}

export const quizzes: Quiz[] = [
  {
    id: 'embeddings-quiz',
    sectionId: 'embeddings',
    questions: [
      {
        id: 'q-similar-meaning',
        type: 'multiple_choice',
        prompt: 'Two sentences with similar meaning end up…',
        options: [
          'Near each other in vector space',
          'In different databases',
          'With identical token counts',
          'Assigned the same ID',
        ],
        answer: 0,
        explanation: 'Embeddings place similar meanings near each other, whatever the exact words.',
      },
      {
        id: 'q-embedding-output',
        type: 'multiple_choice',
        prompt: 'What does an embedding model output for a piece of text?',
        options: ['A list of numbers', 'A summary', 'A translation', 'A keyword'],
        answer: 0,
        explanation: 'An embedding model maps text to a fixed-length vector of floating-point numbers.',
      },
      {
        id: 'q-semantic-keyword',
        type: 'true_false',
        prompt: 'Keyword search can find "dog" when you search for "puppy".',
        answer: false,
        explanation: 'Keyword search matches exact words. Semantic search using embeddings can match by meaning.',
      },
      {
        id: 'q-rank-similarity',
        type: 'multiple_choice',
        prompt: 'Which metric measures how similar two vectors are?',
        options: ['Cosine similarity', 'Euclidean sum', 'Token count', 'Perplexity'],
        answer: 0,
        explanation: 'Cosine similarity measures the angle between two vectors — small angle means similar meaning.',
      },
      {
        id: 'q-pipeline',
        type: 'order',
        prompt: 'Order the embedding pipeline.',
        items: ['Tokenize', 'Embed', 'Compare'],
        explanation: 'Text → tokens → vectors → comparison.',
      },
    ],
  },
  {
    id: 'llm-basics-quiz',
    sectionId: 'llm-basics',
    questions: [
      {
        id: 'q-next-token',
        type: 'multiple_choice',
        prompt: 'What does an LLM predict?',
        options: ['The next token', 'The next sentence', 'A database row', 'An image'],
        answer: 0,
        explanation: 'LLMs generate one token at a time by predicting the most likely next token.',
      },
      {
        id: 'q-lookup',
        type: 'true_false',
        prompt: 'LLMs look answers up in a database.',
        answer: false,
        explanation: 'They generate from learned patterns, not database lookups.',
      },
      {
        id: 'q-params',
        type: 'multiple_choice',
        prompt: 'More parameters generally means…',
        options: ['Better performance', 'Faster inference', 'Smaller file size', 'Fewer tokens'],
        answer: 0,
        explanation: 'Larger models with more parameters tend to perform better, though at higher cost.',
      },
    ],
  },
]

export function getQuiz(id: string) {
  return quizzes.find((q) => q.id === id)
}
