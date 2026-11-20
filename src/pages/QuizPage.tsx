import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSection } from '../data/content'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useProgress } from '../context/ProgressContext'
import type { Question, MCQuestion, TFQuestion, Quiz } from '../data/content'

const accent = '#6A5AE0'

export function QuizPage() {
  const { nodeId = '', sectionId = '' } = useParams()
  const section = getSection(nodeId, sectionId)
  const bp = useBreakpoint()

  if (!section) {
    return (
      <div style={{ padding: 40, fontFamily: 'Figtree, system-ui, sans-serif' }}>
        <p>Quiz not found.</p>
        <Link to="/ai-engineering" style={{ color: accent }}>← Back</Link>
      </div>
    )
  }

  return bp === 'desktop'
    ? <DesktopQuiz quiz={section.quiz} sectionTitle={section.title} nodeId={nodeId} sectionId={sectionId} />
    : <MobileQuiz quiz={section.quiz} sectionTitle={section.title} nodeId={nodeId} sectionId={sectionId} />
}

// ─── Shared quiz logic via hook ───────────────────────────────────────────────

function useQuizState(questions: Question[]) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[current]
  const options: string[] = q.type === 'mc'
    ? (q as MCQuestion).options
    : ['True', 'False']
  const correctIdx = q.type === 'mc'
    ? (q as MCQuestion).answer
    : ((q as TFQuestion).answer ? 0 : 1)
  const isCorrect = selected === correctIdx

  function check() {
    setChecked(true)
    if (isCorrect) setScore((s) => s + 1)
  }

  function next() {
    if (current + 1 >= questions.length) { setDone(true) }
    else { setCurrent((c) => c + 1); setSelected(null); setChecked(false) }
  }

  return { q, options, correctIdx, isCorrect, checked, selected, setSelected, check, next, done, score, current, total: questions.length }
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

function DesktopQuiz({ quiz, sectionTitle, nodeId, sectionId }: { quiz: Quiz; sectionTitle: string; nodeId: string; sectionId: string }) {
  const state = useQuizState(quiz.questions)
  const { q, options, correctIdx, isCorrect, checked, selected, setSelected, check, next, done, score, current, total } = state

  if (done) return <DesktopResult score={score} total={total} nodeId={nodeId} sectionId={sectionId} />

  const pct = Math.round((current / total) * 100)

  return (
    <div style={{ maxWidth: 720, padding: '40px 48px', width: '100%', boxSizing: 'border-box' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 13, color: '#6B6B76' }}>
        <Link to="/ai-engineering" style={{ color: '#6B6B76' }}>AI Engineering</Link>
        <span>›</span>
        <span>{sectionTitle}</span>
        <span>›</span>
        <span style={{ color: '#18181B', fontWeight: 600 }}>Section quiz</span>
      </nav>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
        <div style={{ flex: 1, height: 8, borderRadius: 999, background: '#ECECF0', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: accent, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#6B6B76', flexShrink: 0 }}>{current + 1} / {total}</span>
      </div>

      <div style={{ marginBottom: 12, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent }}>{sectionTitle} · Section quiz</div>
      <h1 style={{ margin: '0 0 28px', fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em', color: '#18181B', lineHeight: 1.3 }}>{q.prompt}</h1>

      <div role="radiogroup" aria-label="Answer options" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {options.map((opt, i) => {
          const sel = selected === i
          const showCorrect = checked && i === correctIdx
          const showWrong = checked && sel && !isCorrect
          let bg = '#F5F5F7', border = '#ECECF0', badgeBg = '#fff', badgeFg = '#6B6B76'
          if (sel && !checked) { bg = `${accent}12`; border = accent; badgeBg = accent; badgeFg = '#fff' }
          if (showCorrect) { bg = '#E7F4EC'; border = '#15803D'; badgeBg = '#15803D'; badgeFg = '#fff' }
          if (showWrong) { bg = '#FEF2F2'; border = '#EF4444'; badgeBg = '#EF4444'; badgeFg = '#fff' }
          return (
            <button key={i} role="radio" aria-checked={sel} disabled={checked} onClick={() => setSelected(i)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 60, padding: '10px 20px 10px 10px', borderRadius: 14, background: bg, border: `2px solid ${border}`, cursor: checked ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
              <span style={{ width: 38, height: 38, borderRadius: 999, background: badgeBg, color: badgeFg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: '#18181B', lineHeight: 1.4 }}>{opt}</span>
              {showCorrect && <svg style={{ color: '#15803D', flexShrink: 0 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>}
              {showWrong && <svg style={{ color: '#EF4444', flexShrink: 0 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>}
            </button>
          )
        })}
      </div>

      {!checked ? (
        <button disabled={selected === null} onClick={check} style={{ width: '100%', height: 50, borderRadius: 14, background: selected !== null ? accent : '#ECECF0', color: selected !== null ? '#fff' : '#6B6B76', fontSize: 16, fontWeight: 600, cursor: selected !== null ? 'pointer' : 'default', transition: 'all 0.15s' }}>
          Check answer
        </button>
      ) : (
        <div style={{ padding: 20, borderRadius: 14, background: isCorrect ? '#E7F4EC' : '#FEF2F2', marginBottom: 16 }}>
          <strong style={{ display: 'block', fontSize: 18, color: isCorrect ? '#15803D' : '#EF4444', marginBottom: 8 }}>{isCorrect ? 'Correct!' : 'Not quite'}</strong>
          <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.6, color: '#18181B' }}>{q.explanation}</p>
          <button onClick={next} style={{ height: 44, padding: '0 24px', borderRadius: 999, background: isCorrect ? '#15803D' : '#EF4444', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {current + 1 >= quiz.questions.length ? 'See results' : 'Next question →'}
          </button>
        </div>
      )}
    </div>
  )
}

function DesktopResult({ score, total, nodeId, sectionId }: { score: number; total: number; nodeId: string; sectionId: string }) {
  const pct = Math.round((score / total) * 100)
  const rank = pct >= 90 ? 'Mastered ⭐⭐⭐' : pct >= 70 ? 'Solid ⭐⭐' : pct >= 50 ? 'Shaky ⭐' : 'Retry'
  const passed = pct >= 70
  const { recordAttempt } = useProgress()
  useEffect(() => { recordAttempt(sectionId, pct, score, total) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{ maxWidth: 720, padding: '40px 48px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: 80, height: 80, borderRadius: 999, background: passed ? '#E7F4EC' : '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>
        {passed ? '✓' : '✗'}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: passed ? '#15803D' : '#EF4444', marginBottom: 8 }}>
        {passed ? 'Section complete' : 'Need more practice'}
      </div>
      <h1 style={{ margin: '0 0 24px', fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em' }}>{pct}% · {rank}</h1>
      <p style={{ margin: '0 0 32px', fontSize: 15, color: '#6B6B76' }}>{score} of {total} correct</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Link to="/ai-engineering" style={{ height: 48, padding: '0 24px', borderRadius: 999, background: '#18181B', color: '#fff', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Back to roadmap</Link>
        <Link to={`/ai-engineering/${nodeId}/${sectionId}/quiz`} onClick={() => window.location.reload()} style={{ height: 48, padding: '0 24px', borderRadius: 999, background: '#F5F5F7', color: '#18181B', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center' }}>Retry</Link>
      </div>
    </div>
  )
}

// ─── Mobile ───────────────────────────────────────────────────────────────────

function MobileQuiz({ quiz, sectionTitle, nodeId, sectionId }: { quiz: Quiz; sectionTitle: string; nodeId: string; sectionId: string }) {
  const state = useQuizState(quiz.questions)
  const { q, options, correctIdx, isCorrect, checked, selected, setSelected, check, next, done, score, current, total } = state

  if (done) return <MobileResult score={score} total={total} nodeId={nodeId} sectionId={sectionId} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 8px', flexShrink: 0 }}>
        <Link to="/ai-engineering" aria-label="Leave quiz"
          style={{ width: 44, height: 52, borderRadius: 999, background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </Link>
        <div style={{ flex: 1, height: 8, borderRadius: 999, background: '#ECECF0', overflow: 'hidden' }}>
          <div style={{ width: `${Math.round((current / total) * 100)}%`, height: '100%', borderRadius: 999, background: accent, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#6B6B76' }}>{current + 1}/{total}</span>
      </header>

      <main style={{ flex: 1, padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent }}>{sectionTitle} · Section quiz</div>
        <h1 style={{ margin: 0, fontSize: 24, lineHeight: 1.25, fontWeight: 500, letterSpacing: '-0.01em' }}>{q.prompt}</h1>
        <div role="radiogroup" aria-label="Answer options" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((opt, i) => {
            const sel = selected === i
            const showCorrect = checked && i === correctIdx
            const showWrong = checked && sel && !isCorrect
            let bg = '#F5F5F7', border = '#ECECF0', badgeBg = '#fff', badgeFg = '#6B6B76'
            if (sel && !checked) { bg = `${accent}12`; border = accent; badgeBg = accent; badgeFg = '#fff' }
            if (showCorrect) { bg = '#E7F4EC'; border = '#15803D'; badgeBg = '#15803D'; badgeFg = '#fff' }
            if (showWrong) { bg = '#FEF2F2'; border = '#EF4444'; badgeBg = '#EF4444'; badgeFg = '#fff' }
            return (
              <button key={i} role="radio" aria-checked={sel} disabled={checked} onClick={() => setSelected(i)}
                style={{ minHeight: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px 8px 8px', borderRadius: 999, background: bg, border: `2px solid ${border}`, cursor: checked ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <span style={{ width: 38, height: 38, borderRadius: 999, background: badgeBg, color: badgeFg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500, lineHeight: 1.35 }}>{opt}</span>
                {showCorrect && <svg style={{ color: '#15803D', flexShrink: 0 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>}
                {showWrong && <svg style={{ color: '#EF4444', flexShrink: 0 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>}
              </button>
            )
          })}
        </div>
      </main>

      {!checked ? (
        <footer style={{ padding: '14px 20px 24px', flexShrink: 0 }}>
          <button disabled={selected === null} onClick={check}
            style={{ width: '100%', height: 52, borderRadius: 999, background: selected !== null ? accent : '#ECECF0', color: selected !== null ? '#fff' : '#6B6B76', fontSize: 17, fontWeight: 600, cursor: selected !== null ? 'pointer' : 'default', transition: 'all 0.15s' }}>
            Check answer
          </button>
        </footer>
      ) : (
        <footer style={{ padding: '20px 20px 24px', background: isCorrect ? '#E7F4EC' : '#FEF2F2', borderRadius: '28px 28px 0 0', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
          <strong style={{ fontSize: 20, color: isCorrect ? '#15803D' : '#EF4444' }}>{isCorrect ? 'Correct!' : 'Not quite'}</strong>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#18181B' }}>{q.explanation}</p>
          <button onClick={next} style={{ height: 50, borderRadius: 999, background: isCorrect ? '#15803D' : '#EF4444', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
            {current + 1 >= total ? 'See results' : 'Continue'}
          </button>
        </footer>
      )}
    </div>
  )
}

function MobileResult({ score, total, nodeId, sectionId }: { score: number; total: number; nodeId: string; sectionId: string }) {
  const pct = Math.round((score / total) * 100)
  const rank = pct >= 90 ? 'Mastered' : pct >= 70 ? 'Solid' : pct >= 50 ? 'Shaky' : 'Retry'
  const passed = pct >= 70
  const { recordAttempt } = useProgress()
  useEffect(() => { recordAttempt(sectionId, pct, score, total) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <main style={{ flex: 1, padding: '40px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="58" fill={passed ? '#E7F4EC' : '#FEF2F2'} />
            <circle cx="60" cy="60" r="46" fill={passed ? '#CDE9D7' : '#FEE2E2'} />
            <path d="M60 6v8M60 106v8M6 60h8M106 60h8M22 22l6 6M92 92l6 6M98 22l-6 6M28 92l-6 6" stroke={passed ? '#15803D' : '#EF4444'} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: passed ? '#15803D' : '#EF4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              {passed ? '✓' : '✗'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: passed ? '#15803D' : '#EF4444', marginBottom: 6 }}>
            {passed ? 'Section complete' : 'Keep practising'}
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>{pct}% · {rank}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
          {[
            { top: `${pct}%`, bottom: `${score} of ${total} right` },
            { top: <Stars count={pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0} of={3} />, bottom: rank },
            { top: <span style={{ color: '#B45309' }}>+{pct >= 70 ? Math.round(pct / 2) : 0}</span>, bottom: 'XP earned' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#F5F5F7', borderRadius: 16, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: i === 1 ? 6 : 4 }}>
              <span style={{ fontSize: 22, fontWeight: 700 }}>{s.top}</span>
              <span style={{ fontSize: 12, color: '#6B6B76' }}>{s.bottom}</span>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
        <Link to="/ai-engineering" style={{ height: 52, borderRadius: 999, background: '#18181B', color: '#fff', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Back to roadmap</Link>
        <Link to={`/ai-engineering/${nodeId}/${sectionId}/quiz`} onClick={() => window.location.reload()} style={{ height: 52, borderRadius: 999, background: '#F5F5F7', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Retry for three stars</Link>
      </footer>
    </div>
  )
}

function Stars({ count, of }: { count: number; of: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, color: '#B45309' }}>
      {Array.from({ length: of }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < count ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={i < count ? 0 : 1.6} aria-hidden="true">
          <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      ))}
    </div>
  )
}
