import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'

// ─── Storage schema ────────────────────────────────────────────────────────────
// Two append-only logs. Never mutate entries — only append.

export interface LessonRead { lessonId: string; minutes: number; at: string }
export interface QuizAttempt { sectionId: string; score: number; correct: number; total: number; at: string }

const READS_KEY = 'amde_reads'
const ATTEMPTS_KEY = 'amde_attempts'

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') } catch { return [] }
}
function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

// ─── Derivations ───────────────────────────────────────────────────────────────

function toDay(iso: string) { return iso.slice(0, 10) }

function computeStreak(reads: LessonRead[], attempts: QuizAttempt[]): number {
  const days = new Set([
    ...reads.map((r) => toDay(r.at)),
    ...attempts.map((a) => toDay(a.at)),
  ])
  const sorted = [...days].sort().reverse() // newest first
  if (!sorted.length) return 0

  const today = toDay(new Date().toISOString())
  const yesterday = toDay(new Date(Date.now() - 86_400_000).toISOString())
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 0
  let expected = sorted[0]
  for (const day of sorted) {
    if (day === expected) {
      streak++
      const d = new Date(expected + 'T12:00:00Z')
      d.setUTCDate(d.getUTCDate() - 1)
      expected = d.toISOString().slice(0, 10)
    } else {
      break
    }
  }
  return streak
}

function computeXP(reads: LessonRead[], attempts: QuizAttempt[]): number {
  const uniqueLessons = new Set(reads.map((r) => r.lessonId)).size
  const attemptXP = attempts
    .filter((a) => a.score >= 70)
    .reduce((sum, a) => sum + Math.floor(a.score / 2), 0)
  return uniqueLessons * 10 + attemptXP
}

export interface WeekDay { label: string; mins: number; today: boolean }

function computeWeeklyMins(reads: LessonRead[], attempts: QuizAttempt[]): WeekDay[] {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const now = new Date()
  const dow = now.getDay() // 0=Sun
  const mondayOffset = dow === 0 ? -6 : 1 - dow

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() + mondayOffset + i)
    const dayStr = d.toISOString().slice(0, 10)
    const readMins = reads.filter((r) => toDay(r.at) === dayStr).reduce((s, r) => s + r.minutes, 0)
    const quizMins = attempts.filter((a) => toDay(a.at) === dayStr).length * 5
    return { label: labels[d.getDay()], mins: readMins + quizMins, today: dayStr === toDay(now.toISOString()) }
  })
}

function bestScoresBySection(attempts: QuizAttempt[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const a of attempts) {
    if ((m.get(a.sectionId) ?? -1) < a.score) m.set(a.sectionId, a.score)
  }
  return m
}

// ─── Context ───────────────────────────────────────────────────────────────────

export interface ProgressValue {
  readLessons: string[]
  completedSections: string[]
  streak: number
  xp: number
  weeklyMins: WeekDay[]
  markLessonRead: (lessonId: string, minutes: number) => void
  recordAttempt: (sectionId: string, score: number, correct: number, total: number) => void
  clearProgress: () => void
}

const Ctx = createContext<ProgressValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [reads, setReads] = useState<LessonRead[]>(() => load(READS_KEY))
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => load(ATTEMPTS_KEY))

  const value = useMemo<ProgressValue>(() => {
    const best = bestScoresBySection(attempts)
    return {
      readLessons: [...new Set(reads.map((r) => r.lessonId))],
      completedSections: [...best.entries()].filter(([, s]) => s >= 70).map(([id]) => id),
      streak: computeStreak(reads, attempts),
      xp: computeXP(reads, attempts),
      weeklyMins: computeWeeklyMins(reads, attempts),
      markLessonRead(lessonId, minutes) {
        setReads((prev) => {
          const today = toDay(new Date().toISOString())
          if (prev.some((r) => r.lessonId === lessonId && toDay(r.at) === today)) return prev
          const next = [...prev, { lessonId, minutes, at: new Date().toISOString() }]
          save(READS_KEY, next)
          return next
        })
      },
      recordAttempt(sectionId, score, correct, total) {
        setAttempts((prev) => {
          const next = [...prev, { sectionId, score, correct, total, at: new Date().toISOString() }]
          save(ATTEMPTS_KEY, next)
          return next
        })
      },
      clearProgress() {
        localStorage.removeItem(READS_KEY)
        localStorage.removeItem(ATTEMPTS_KEY)
        setReads([])
        setAttempts([])
      },
    }
  }, [reads, attempts])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProgress(): ProgressValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
