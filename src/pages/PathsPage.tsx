import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { aiEngineering } from '../data/content'
import { useProgress } from '../context/ProgressContext'

const allPaths = [
  { id: 'ai-engineering', title: 'AI Engineering', icon: '🤖', accent: '#6A5AE0', desc: 'Build with LLMs, embeddings, and retrieval systems.', meta: '4 nodes · 8 sections', pill: 'Started', to: '/ai-engineering' },
  { id: 'python', title: 'Python', icon: '🐍', accent: '#E2B93B', desc: 'Write clean, idiomatic Python from day one.', meta: '5 nodes · 12 sections', pill: 'New', to: '#' },
  { id: 'data', title: 'Data Analytics', icon: '📊', accent: '#0F766E', desc: 'Query, visualise, and interpret data with SQL, Pandas, and Plotly.', meta: '4 nodes · 10 sections', pill: 'New', to: '#' },
  { id: 'web', title: 'Web Development', icon: '🌐', accent: '#2563EB', desc: 'HTML, CSS, JavaScript, React, and deployment.', meta: '6 nodes · 15 sections', pill: 'New', to: '/web-dev' },
  { id: 'devops', title: 'DevOps & Cloud', icon: '☁️', accent: '#6B7280', desc: 'Docker, Kubernetes, CI/CD, and AWS basics.', meta: '5 nodes · 11 sections', pill: 'New', to: '#' },
]

const filters = ['All', 'Started', 'New', 'Complete']

export function PathsPage() {
  const bp = useBreakpoint()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const { completedSections } = useProgress()
  const pct = Math.round((completedSections.length / aiEngineering.nodes.reduce((n, nd) => n + nd.sections.length, 0)) * 100)

  const shown = allPaths.filter((p) => {
    const matchQ = p.title.toLowerCase().includes(q.toLowerCase()) || p.desc.toLowerCase().includes(q.toLowerCase())
    const matchF = filter === 'All' || p.pill === filter
    return matchQ && matchF
  })

  const content = (
    <>
      <header style={{ padding: bp === 'desktop' ? '40px 0 24px' : '24px 20px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: bp === 'desktop' ? 28 : 26, fontWeight: 500, letterSpacing: '-0.02em', color: '#18181B' }}>Paths</h1>
        <span style={{ fontSize: 14, color: '#6B6B76' }}>{allPaths.length} paths</span>
      </header>

      <div style={{ padding: bp === 'desktop' ? '0 0 24px' : '0 20px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Search */}
        <label style={{ height: 44, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderRadius: 999, background: '#F5F5F7', border: '1px solid #ECECF0' }}>
          <svg style={{ color: '#6B6B76', flexShrink: 0 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search paths"
            style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', font: 'inherit', fontSize: 15, color: '#18181B' }} />
        </label>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {filters.map((f) => {
            const active = filter === f
            const count = f === 'All' ? allPaths.length : allPaths.filter((p) => p.pill === f).length
            return (
              <button key={f} aria-pressed={active} onClick={() => setFilter(f)}
                style={{ height: 36, padding: '0 14px', borderRadius: 999, whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, background: active ? '#18181B' : '#F5F5F7', color: active ? '#fff' : '#18181B', border: `1px solid ${active ? '#18181B' : '#ECECF0'}`, cursor: 'pointer' }}>
                {f} <span style={{ opacity: 0.6, fontWeight: 400 }}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <main style={{ flex: 1, minHeight: 0, padding: bp === 'desktop' ? '0 0 40px' : '0 20px 16px', display: bp === 'desktop' ? 'grid' : 'flex', gridTemplateColumns: bp === 'desktop' ? 'repeat(auto-fill, minmax(340px, 1fr))' : undefined, flexDirection: bp === 'desktop' ? undefined : 'column', gap: 12, overflowY: 'auto', alignContent: 'start' }}>
        {shown.map((p) => {
          const pathPct = p.id === 'ai-engineering' ? pct : 0
          return (
            <Link key={p.id} to={p.to}
              style={{ background: '#F5F5F7', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 48, height: 48, borderRadius: 16, background: `${p.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{p.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#18181B', marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.4, color: '#6B6B76' }}>{p.desc}</div>
                </div>
                <span style={{ flexShrink: 0, height: 24, padding: '0 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: p.pill === 'Started' ? `${p.accent}18` : '#ECECF0', color: p.pill === 'Started' ? p.accent : '#6B6B76', display: 'flex', alignItems: 'center' }}>
                  {p.pill}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#6B6B76', flexShrink: 0 }}>{p.meta}</span>
                <div style={{ flex: 1, height: 5, borderRadius: 999, background: '#ECECF0', overflow: 'hidden' }}>
                  <div style={{ width: `${pathPct}%`, height: '100%', borderRadius: 999, background: p.accent }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, minWidth: 32, textAlign: 'right', color: '#18181B' }}>{pathPct}%</span>
              </div>
            </Link>
          )
        })}
        {shown.length === 0 && (
          <div style={{ padding: '48px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: '#6B6B76', margin: 0 }}>No paths match "{q}"</p>
          </div>
        )}
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

  return <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>{content}</div>
}
