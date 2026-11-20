import { Link } from 'react-router-dom'
import { AmdeLogoIcon } from '../components/AmdeLogo'
import { ProgressRing } from '../components/ProgressRing'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { aiEngineering } from '../data/content'
import { useProgress } from '../context/ProgressContext'

const accent = aiEngineering.accent

type NextLesson = {
  nodeId: string
  sectionId: string
  lessonId: string
  lessonTitle: string
  sectionTitle: string
  minutes: number
  sectionPct: number
}

function findNextLesson(readLessons: string[]): NextLesson | null {
  for (const node of aiEngineering.nodes) {
    for (const section of node.sections) {
      for (const lesson of section.lessons) {
        if (!readLessons.includes(lesson.id)) {
          const done = section.lessons.filter((l) => readLessons.includes(l.id)).length
          return {
            nodeId: node.id,
            sectionId: section.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            sectionTitle: section.title,
            minutes: lesson.minutes,
            sectionPct: Math.round((done / section.lessons.length) * 100),
          }
        }
      }
    }
  }
  return null
}

export function HomePage() {
  const bp = useBreakpoint()
  const { completedSections, readLessons, streak, xp, weeklyMins } = useProgress()
  const pct = Math.round((completedSections.length / aiEngineering.nodes.reduce((n, nd) => n + nd.sections.length, 0)) * 100)
  const weekTotal = weeklyMins.reduce((s, d) => s + d.mins, 0)
  const next = findNextLesson(readLessons)

  return bp === 'desktop'
    ? <DesktopHome pct={pct} next={next} completedSections={completedSections} streak={streak} xp={xp} weeklyMins={weeklyMins} weekTotal={weekTotal} />
    : <MobileHome pct={pct} next={next} streak={streak} xp={xp} />
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

function DesktopHome({ pct, next, completedSections, streak, xp, weekTotal }: { pct: number; next: NextLesson | null; completedSections: string[]; streak: number; xp: number; weeklyMins: { label: string; mins: number; today: boolean }[]; weekTotal: number }) {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 1000, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', color: '#18181B' }}>Good morning, Henok</h1>
      <p style={{ margin: '0 0 36px', fontSize: 16, color: '#6B6B76' }}>One screen at a time.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Continue card */}
          {next ? (
            <Link to={`/ai-engineering/${next.nodeId}/${next.sectionId}/${next.lessonId}`}
              style={{ borderRadius: 24, background: `${accent}18`, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ width: 52, height: 52, borderRadius: 16, background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent, marginBottom: 4 }}>Continue · {next.sectionTitle}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: '#18181B' }}>{next.lessonTitle}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.6)', overflow: 'hidden' }}>
                  <div style={{ width: `${next.sectionPct}%`, height: '100%', borderRadius: 999, background: accent }} />
                </div>
                <span style={{ fontSize: 13, color: '#3F3F46', flexShrink: 0 }}>{next.minutes} min</span>
              </div>
            </Link>
          ) : (
            <Link to="/ai-engineering"
              style={{ borderRadius: 24, background: `${accent}18`, padding: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
              </span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent, marginBottom: 4 }}>All lessons complete</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#18181B' }}>AI Engineering</div>
              </div>
            </Link>
          )}

          {/* Your paths */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#18181B' }}>Your paths</h2>
              <Link to="/paths" style={{ fontSize: 14, color: '#6B6B76' }}>See all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'ai-engineering', title: 'AI Engineering', icon: '🤖', pct, accent, sections: `${completedSections.length} of ${aiEngineering.nodes.reduce((n, nd) => n + nd.sections.length, 0)} sections`, to: '/ai-engineering' },
                { id: 'python', title: 'Python', icon: '🐍', pct: 0, accent: '#E2B93B', sections: 'Not started', to: '/paths' },
                { id: 'data', title: 'Data Analytics', icon: '📊', pct: 0, accent: '#0F766E', sections: 'Not started', to: '/paths' },
              ].map((path) => (
                <Link key={path.id} to={path.to} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 64, borderRadius: 16, background: '#F5F5F7', padding: '0 20px 0 10px' }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: `${path.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {path.icon}
                  </span>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: '#18181B' }}>{path.title}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 999, background: '#ECECF0', overflow: 'hidden', maxWidth: 200 }}>
                    <div style={{ width: `${path.pct}%`, height: '100%', borderRadius: 999, background: path.accent }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#6B6B76', minWidth: 36, textAlign: 'right' }}>{path.pct}%</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: '🔥', value: streak > 0 ? `${streak}` : '—', label: 'day streak', color: '#C2410C', bg: '#FDF1E7' },
              { icon: '⚡', value: `${xp}`, label: 'total XP', color: '#B45309', bg: '#FCEFC0' },
              { icon: '⏱', value: weekTotal > 0 ? `${weekTotal}m` : '—', label: 'this week', color: accent, bg: `${accent}12` },
              { icon: '✓', value: `${completedSections.length}`, label: 'sections done', color: '#15803D', bg: '#E7F4EC' },
            ].map((s, i) => (
              <div key={i} style={{ padding: 16, borderRadius: 16, background: s.bg, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#18181B' }}>{s.value}</span>
                <span style={{ fontSize: 12, color: '#6B6B76' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Study time chart */}
          <div style={{ padding: 20, borderRadius: 16, background: '#F5F5F7' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#18181B' }}>Study time this week</h3>
            <StudyChart />
          </div>

          {/* AI Engineering progress */}
          <Link to="/ai-engineering" style={{ padding: 20, borderRadius: 16, background: `${accent}10`, border: `1px solid ${accent}30`, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ProgressRing pct={pct} size={44} stroke={4} accent={accent} label={`${pct}%`} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#18181B' }}>AI Engineering</div>
                <div style={{ fontSize: 12, color: '#6B6B76' }}>{completedSections.length} of {aiEngineering.nodes.reduce((n, nd) => n + nd.sections.length, 0)} sections complete</div>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: accent }}>Continue learning →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StudyChart() {
  const days = [
    { label: 'M', mins: 0 }, { label: 'T', mins: 12 }, { label: 'W', mins: 18 },
    { label: 'T', mins: 20, today: true }, { label: 'F', mins: 0 }, { label: 'S', mins: 0 }, { label: 'S', mins: 0 },
  ]
  const max = Math.max(...days.map((d) => d.mins), 1)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, alignItems: 'end', height: 80 }}>
      {days.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {d.mins > 0 && <span style={{ fontSize: 10, fontWeight: 600, color: '#18181B' }}>{d.mins}</span>}
          <div style={{ width: '100%', height: Math.max(4, (d.mins / max) * 56), borderRadius: 999, background: d.mins === 0 ? '#ECECF0' : d.today ? accent : `${accent}60` }} />
          <span style={{ fontSize: 11, color: '#6B6B76', fontWeight: d.today ? 700 : 400 }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Mobile ───────────────────────────────────────────────────────────────────

function MobileHome({ pct, next, streak, xp }: { pct: number; next: NextLesson | null; streak: number; xp: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 14px 0 6px', borderRadius: 999, background: '#F5F5F7' }}>
          <AmdeLogoIcon size={32} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>Amde</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {streak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 44, padding: '0 14px', borderRadius: 999, background: '#FCEFC0', fontSize: 15, fontWeight: 600 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.8 1.2 2.8 2.5 3V3z" /></svg>
              {streak}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 44, padding: '0 14px', borderRadius: 999, background: `${accent}1A`, fontSize: 15, fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>
            {xp} XP
          </div>
        </div>
      </header>

      <main style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 20, padding: '12px 20px 16px', overflowY: 'auto' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em' }}>Hello Henok</h1>
          <p style={{ margin: 0, fontSize: 15, color: '#6B6B76' }}>One screen at a time.</p>
        </div>

        {/* Quick grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, height: 220 }}>
          {next ? (
            <Link to={`/ai-engineering/${next.nodeId}/${next.sectionId}/${next.lessonId}`}
              style={{ gridRow: 'span 2', borderRadius: 24, background: `${accent}22`, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#3A3A44' }}>{next.sectionTitle}</span>
                <span style={{ fontSize: 19, lineHeight: 1.2, fontWeight: 600 }}>{next.lessonTitle}</span>
                <span style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.6)', overflow: 'hidden', display: 'block' }}>
                  <span style={{ display: 'block', width: `${next.sectionPct}%`, height: '100%', borderRadius: 999, background: '#18181B' }} />
                </span>
                <span style={{ fontSize: 12, color: '#3A3A44' }}>Continue · {next.minutes} min</span>
              </span>
            </Link>
          ) : (
            <Link to="/ai-engineering"
              style={{ gridRow: 'span 2', borderRadius: 24, background: `${accent}22`, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
              </span>
              <span style={{ fontSize: 16, fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>All lessons complete!</span>
            </Link>
          )}
          <Link to="/paths" style={{ borderRadius: 24, background: '#FCEFC0', padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg>
            </span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Browse paths</span>
          </Link>
          <Link to="/review" style={{ borderRadius: 24, background: '#18181B', color: '#fff', padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            <span style={{ position: 'absolute', right: 10, top: 10, background: '#F87171', color: '#18181B', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>1 due</span>
            <span style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" /></svg>
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Review</span>
          </Link>
        </div>

        {/* Your paths list */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Your paths</h2>
            <Link to="/paths" style={{ fontSize: 15, color: '#6B6B76', minHeight: 44, display: 'flex', alignItems: 'center' }}>See all</Link>
          </div>
          {[
            { title: 'AI Engineering', to: '/ai-engineering', accent, pct, icon: '🤖' },
            { title: 'Python', to: '/paths', accent: '#E2B93B', pct: 0, icon: '🐍' },
            { title: 'Data Analytics', to: '/paths', accent: '#0F766E', pct: 0, icon: '📊' },
          ].map((p) => (
            <Link key={p.title} to={p.to} style={{ height: 56, borderRadius: 999, background: '#F5F5F7', padding: '0 18px 0 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 40, height: 40, borderRadius: 999, background: `${p.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{p.title}</span>
              <span style={{ fontSize: 14, color: '#6B6B76' }}>{p.pct > 0 ? `${p.pct}%` : 'New'}</span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
