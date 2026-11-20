import { Link } from 'react-router-dom'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { aiEngineering } from '../data/content'
import { useProgress } from '../context/ProgressContext'

const accent = aiEngineering.accent

export function ProgressPage() {
  const bp = useBreakpoint()
  const { completedSections, streak, xp, weeklyMins } = useProgress()
  const days = weeklyMins
  const max = Math.max(...days.map((d) => d.mins), 1)

  const content = (
    <>
      <header style={{ padding: bp === 'desktop' ? '40px 0 24px' : '24px 20px 8px' }}>
        <h1 style={{ margin: 0, fontSize: bp === 'desktop' ? 28 : 26, fontWeight: 500, letterSpacing: '-0.02em', color: '#18181B' }}>Progress</h1>
      </header>

      <main style={{ flex: 1, padding: bp === 'desktop' ? '0 0 40px' : '8px 20px 16px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { icon: <svg style={{ color: '#C2410C' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.8 1.2 2.8 2.5 3V3z" /></svg>, value: streak > 0 ? `${streak} day${streak === 1 ? '' : 's'}` : '—', label: 'Streak' },
            { icon: <svg style={{ color: '#B45309' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>, value: `${xp}`, label: 'Total XP' },
            { icon: <svg style={{ color: accent }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>, value: '50 min', label: 'This week' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#F5F5F7', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {s.icon}
              <span style={{ fontSize: bp === 'desktop' ? 22 : 20, fontWeight: 700, color: '#18181B' }}>{s.value}</span>
              <span style={{ fontSize: 12, color: '#6B6B76' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Study time chart */}
        <section style={{ background: '#F5F5F7', borderRadius: 20, padding: 16 }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600, color: '#18181B' }}>Study time this week</h2>
          <div role="img" aria-label="Minutes studied this week" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, alignItems: 'end', height: 100 }}>
            {days.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                {d.mins > 0 && <span style={{ fontSize: 10, fontWeight: 600, color: '#18181B' }}>{d.mins}</span>}
                <div style={{ width: '100%', height: Math.max(4, (d.mins / max) * 60), borderRadius: 999, background: d.mins === 0 ? '#ECECF0' : d.today ? accent : `${accent}55` }} />
                <span style={{ fontSize: 11, color: '#6B6B76', fontWeight: d.today ? 700 : 400 }}>{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Subject breakdown */}
        <section style={{ background: '#F5F5F7', borderRadius: 20, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#18181B' }}>AI Engineering</h2>
            <span style={{ fontSize: 13, color: '#6B6B76' }}>{completedSections.length} of {aiEngineering.nodes.reduce((n, nd) => n + nd.sections.length, 0)} sections</span>
          </div>
          <div style={{ height: 7, borderRadius: 999, background: '#ECECF0', overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ width: `${Math.round((completedSections.length / aiEngineering.nodes.reduce((n, nd) => n + nd.sections.length, 0)) * 100)}%`, height: '100%', borderRadius: 999, background: accent }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {aiEngineering.nodes.flatMap((node) =>
              node.sections.map((section, i, arr) => (
                <div key={section.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid #ECECF0' : undefined }}>
                  <span style={{ fontSize: 14, color: '#18181B' }}>{section.title}</span>
                  {completedSections.includes(section.id) ? (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#15803D' }}>80% · Solid</span>
                  ) : (
                    <span style={{ fontSize: 13, color: '#6B6B76' }}>Not attempted</span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Weak spot */}
        <Link to="/review" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 16, background: '#FDF1E7', border: '1px solid #F3D9C2' }}>
          <svg style={{ color: '#C2410C', flexShrink: 0 }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#18181B' }}>Weak spot: Rank by similarity</div>
            <div style={{ fontSize: 13, color: '#6B3A16', marginTop: 2 }}>Embeddings · 1 question due tomorrow</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
        </Link>
      </main>
    </>
  )

  if (bp === 'desktop') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 48px', width: '100%', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {content}
      </div>
    </div>
  )
  return <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>{content}</div>
}
