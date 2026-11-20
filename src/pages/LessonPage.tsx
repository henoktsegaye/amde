import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLesson } from '../data/content'
import { BlockRenderer } from '../components/BlockRenderer'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useProgress } from '../context/ProgressContext'

const accent = '#6A5AE0'

export function LessonPage() {
  const { nodeId = '', sectionId = '', lessonId = '' } = useParams()
  const lesson = getLesson(nodeId, sectionId, lessonId)
  const bp = useBreakpoint()

  if (!lesson) {
    return (
      <div style={{ padding: 40, fontFamily: 'Figtree, system-ui, sans-serif', color: '#18181B' }}>
        <p>Lesson not found.</p>
        <Link to="/ai-engineering" style={{ color: accent }}>← Back to roadmap</Link>
      </div>
    )
  }

  return bp === 'desktop'
    ? <DesktopLesson lesson={lesson} nodeId={nodeId} sectionId={sectionId} />
    : <MobileLesson lesson={lesson} nodeId={nodeId} sectionId={sectionId} />
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

function DesktopLesson({ lesson, nodeId, sectionId }: { lesson: ReturnType<typeof getLesson> & object; nodeId: string; sectionId: string }) {
  const { markLessonRead } = useProgress()
  return (
    <article style={{ maxWidth: 720, padding: '40px 48px', width: '100%', boxSizing: 'border-box' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 13, color: '#6B6B76' }}>
        <Link to="/ai-engineering" style={{ color: '#6B6B76' }}>AI Engineering</Link>
        <span>›</span>
        <span style={{ textTransform: 'capitalize' }}>{sectionId.replace(/-/g, ' ')}</span>
        <span>›</span>
        <span style={{ color: '#18181B', fontWeight: 600 }}>{lesson.title}</span>
      </nav>

      <header style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent, marginBottom: 8 }}>
          {sectionId.replace(/-/g, ' ')} · {lesson.minutes} min read
        </div>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', color: '#18181B', lineHeight: 1.15 }}>{lesson.title}</h1>
      </header>

      {/* All screens rendered as sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {lesson.screens.map((screen, i) => (
          <section key={i}>
            <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 600, color: '#18181B', letterSpacing: '-0.01em' }}>
              {screen.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {screen.blocks.map((block, j) => (
                <BlockRenderer key={j} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #ECECF0', display: 'flex', gap: 12 }}>
        <Link
          to={`/ai-engineering/${nodeId}/${sectionId}/quiz`}
          onClick={() => markLessonRead(lesson.id, lesson.minutes)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 24px', borderRadius: 999, background: '#15803D', color: '#fff', fontSize: 15, fontWeight: 600 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          Mark read · Take section quiz
        </Link>
        <Link
          to={`/ai-engineering`}
          style={{ display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 24px', borderRadius: 999, background: '#F5F5F7', color: '#18181B', fontSize: 15, fontWeight: 500 }}
        >
          Back to roadmap
        </Link>
      </div>
    </article>
  )
}

// ─── Mobile ───────────────────────────────────────────────────────────────────

function MobileLesson({ lesson, nodeId, sectionId }: { lesson: ReturnType<typeof getLesson> & object; nodeId: string; sectionId: string }) {
  const [current, setCurrent] = useState(0)
  const { markLessonRead } = useProgress()
  const total = lesson.screens.length
  const screen = lesson.screens[current]
  const isLast = current === total - 1

  // Mark read as soon as the last screen is visible
  useEffect(() => {
    if (isLast) markLessonRead(lesson.id, lesson.minutes)
  }, [isLast, lesson.id, lesson.minutes, markLessonRead])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 8px', flexShrink: 0 }}>
        <Link to={`/ai-engineering`} aria-label="Close lesson"
          style={{ width: 44, height: 52, borderRadius: 999, background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </Link>
        <div style={{ flex: 1, display: 'flex', gap: 5 }}>
          {lesson.screens.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 7, borderRadius: 999, background: i <= current ? accent : '#ECECF0', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => setCurrent(i)} />
          ))}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#6B6B76', minWidth: 28, textAlign: 'right' }}>{current + 1}/{total}</span>
      </header>

      <div style={{ padding: '4px 20px 0', fontSize: 13, color: '#6B6B76', flexShrink: 0 }}>
        {sectionId.replace(/-/g, ' ')} · {lesson.title}
      </div>

      <main style={{ flex: 1, padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>{screen.title}</h1>
        {screen.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </main>

      <footer style={{ display: 'flex', gap: 10, padding: '14px 20px 24px', flexShrink: 0 }}>
        <button disabled={current === 0} onClick={() => setCurrent((c) => c - 1)} aria-label="Previous"
          style={{ width: 48, height: 52, borderRadius: 999, background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: current === 0 ? 0.4 : 1, cursor: current === 0 ? 'default' : 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        {!isLast ? (
          <button onClick={() => setCurrent((c) => c + 1)} style={{ flex: 1, height: 52, borderRadius: 999, background: '#18181B', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Next</button>
        ) : (
          <Link to={`/ai-engineering/${nodeId}/${sectionId}/quiz`}
            style={{ flex: 1, height: 52, borderRadius: 999, background: '#15803D', color: '#fff', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
            Lesson read · Take quiz
          </Link>
        )}
      </footer>
    </div>
  )
}
