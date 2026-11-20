export type NodeState = 'locked' | 'available' | 'in-progress' | 'completed'

export interface Lesson {
  id: string
  title: string
  minutes: number
}

export interface Section {
  id: string
  title: string
  lessons: Lesson[]
  quizId: string
}

export interface SubjectNode {
  id: string
  title: string
  icon: string
  prerequisites: string[]
  sections: Section[]
}

export interface Subject {
  id: string
  title: string
  icon: string
  accent: string
  tint: string
  description: string
  nodes: SubjectNode[]
}

export const subjects: Subject[] = [
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    icon: 'cpu',
    accent: '#6A5AE0',
    tint: 'rgba(106,90,224,0.12)',
    description: 'Build with LLMs, embeddings, and retrieval systems.',
    nodes: [
      {
        id: 'foundations',
        title: 'Foundations',
        icon: 'home',
        prerequisites: [],
        sections: [
          {
            id: 'llm-basics',
            title: 'LLM basics',
            quizId: 'llm-basics-quiz',
            lessons: [
              { id: 'what-is-an-llm', title: 'What is an LLM?', minutes: 4 },
              { id: 'tokens', title: 'Tokens', minutes: 5 },
              { id: 'training', title: 'How LLMs are trained', minutes: 6 },
            ],
          },
          {
            id: 'embeddings',
            title: 'Embeddings',
            quizId: 'embeddings-quiz',
            lessons: [
              { id: 'text-becomes-vectors', title: 'Text becomes vectors', minutes: 4 },
              { id: 'meaning-as-distance', title: 'Meaning as distance', minutes: 5 },
            ],
          },
        ],
      },
      {
        id: 'prompting',
        title: 'Prompting',
        icon: 'message',
        prerequisites: ['foundations'],
        sections: [
          {
            id: 'prompt-basics',
            title: 'Prompt basics',
            quizId: 'prompt-basics-quiz',
            lessons: [
              { id: 'system-prompts', title: 'System prompts', minutes: 4 },
              { id: 'few-shot', title: 'Few-shot prompting', minutes: 5 },
              { id: 'chain-of-thought', title: 'Chain of thought', minutes: 6 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    icon: 'code',
    accent: '#E2B93B',
    tint: 'rgba(226,185,59,0.15)',
    description: 'Write clean, idiomatic Python from day one.',
    nodes: [],
  },
  {
    id: 'data-analytics',
    title: 'Data analytics',
    icon: 'bar-chart',
    accent: '#18181B',
    tint: 'rgba(24,24,27,0.08)',
    description: 'Query, visualize, and interpret data.',
    nodes: [],
  },
  {
    id: 'web-dev',
    title: 'Web development',
    icon: 'globe',
    accent: '#0F766E',
    tint: 'rgba(15,118,110,0.12)',
    description: 'HTML, CSS, JavaScript, and beyond.',
    nodes: [],
  },
]

export function getSubject(id: string) {
  return subjects.find((s) => s.id === id)
}
