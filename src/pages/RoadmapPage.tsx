import { Link, useParams } from 'react-router-dom'
import { getSubject } from '../data/subjects'
import { ProgressRing } from '../components/ProgressRing'

export function RoadmapPage() {
  const { subjectId } = useParams()
  const subject = getSubject(subjectId ?? 'ai-engineering') ?? getSubject('ai-engineering')!
  const accent = subject.accent

  const node0 = subject.nodes[0]
  const node1 = subject.nodes[1]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF', fontFamily: 'Figtree, system-ui, sans-serif', color: '#18181B' }}>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 8px' }}>
        <Link
          to="/"
          aria-label="Back to home"
          style={{ width: 44, height: 52, borderRadius: 999, background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </Link>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>{subject.title}</span>
          <span style={{ fontSize: 13, color: '#6B6B76' }}>
            {subject.nodes.length} nodes · {subject.nodes.reduce((s, n) => s + n.sections.length, 0)} sections · {subject.nodes.reduce((s, n) => s + n.sections.reduce((ss, sec) => ss + sec.lessons.length, 0), 0)} lessons
          </span>
        </div>
        <ProgressRing pct={33} size={48} accent={accent} label="33%" />
      </header>

      {/* SVG roadmap */}
      <section aria-label="Roadmap" style={{ position: 'relative', height: 330, flexShrink: 0 }}>
        <svg width="390" height="330" viewBox="0 0 390 330" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden="true">
          <path d="M120 78 C 120 160, 280 110, 280 186 C 280 262, 130 232, 130 292" fill="none" stroke="#D4D4D8" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 14" />
          <path d="M120 78 C 120 130, 180 132, 214 140" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        </svg>

        {/* Node 1 — in progress */}
        <button
          aria-pressed="true"
          style={{ position: 'absolute', left: 66, top: 24, width: 108, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          onClick={() => {}}
        >
          <span style={{ position: 'relative', width: 108, height: 108, display: 'block' }}>
            <NodeRing pct={50} accent={accent} />
            <span style={{ position: 'absolute', left: 22, top: 22, width: 64, height: 64, borderRadius: 999, background: accent, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" />
              </svg>
            </span>
          </span>
        </button>
        <div style={{ position: 'absolute', left: 186, top: 40, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent }}>In progress</span>
          <span style={{ fontSize: 20, fontWeight: 600 }}>{node0?.title}</span>
          <span style={{ fontSize: 13, color: '#6B6B76' }}>1 of {node0?.sections.length} sections</span>
        </div>

        {/* Node 2 — locked */}
        <button
          aria-label={`${node1?.title}, locked`}
          style={{ position: 'absolute', left: 240, top: 146, width: 80, height: 80, borderRadius: 999, background: '#F5F5F7', border: '2px dashed #D4D4D8', color: '#6B6B76', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </button>
        <div style={{ position: 'absolute', left: 60, top: 160, width: 168, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, textAlign: 'right' }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B76' }}>Locked</span>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#3F3F46' }}>{node1?.title}</span>
          <span style={{ fontSize: 13, color: '#6B6B76' }}>Finish {node0?.title} first</span>
        </div>

        {/* Complete marker */}
        <div style={{ position: 'absolute', left: 106, top: 268, width: 48, height: 52, borderRadius: 999, background: '#FFFFFF', border: '2px solid #ECECF0', color: '#6B6B76', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
          </svg>
        </div>
        <span style={{ position: 'absolute', left: 166, top: 282, fontSize: 13, fontWeight: 600, color: '#6B6B76' }}>Subject complete</span>
      </section>

      {/* Sections panel */}
      <section
        aria-label={`${node0?.title} sections`}
        style={{ flex: 1, background: '#FFFFFF', borderRadius: '32px 32px 0 0', border: '1px solid #ECECF0', borderBottom: 0, padding: '12px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}
      >
        <div style={{ width: 40, height: 5, borderRadius: 999, background: '#ECECF0', alignSelf: 'center' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{node0?.title}</h2>
          <span style={{ fontSize: 13, color: '#6B6B76' }}>Node 1</span>
        </div>

        {/* Section 1 — complete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, background: '#E7F4EC' }}>
          <div style={{ width: 44, height: 52, borderRadius: 999, background: '#15803D', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 12 5 5 9-10" />
            </svg>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>LLM basics</span>
            <span style={{ fontSize: 13, color: '#2F5E40' }}>Best 80% · Solid</span>
          </div>
          <Stars count={2} of={3} />
        </div>

        {/* Section 2 — in progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 20, border: `2px solid ${accent}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 52, borderRadius: 999, background: `${accent}1E`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: 15 }}>
              2
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>Embeddings</span>
              <span style={{ fontSize: 13, color: '#6B6B76' }}>1 of 2 lessons read · quiz next</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 999, background: accent }} />
            <div style={{ flex: 1, height: 6, borderRadius: 999, background: `${accent}66` }} />
            <div style={{ flex: 1, height: 6, borderRadius: 999, background: '#F5F5F7' }} />
          </div>
          <Link
            to={`/subject/${subject.id}/node/${node0?.id}/section/embeddings/lesson/meaning-as-distance`}
            style={{ height: 52, borderRadius: 999, background: '#18181B', color: '#FFFFFF', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Continue · Meaning as distance
          </Link>
        </div>
      </section>
    </div>
  )
}

function NodeRing({ pct, accent }: { pct: number; accent: string }) {
  const r = 46
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="108" height="108" viewBox="0 0 108 108" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0 }}>
      <circle cx="54" cy="54" r="50" fill="#FFFFFF" stroke="#ECECF0" strokeWidth="2" />
      <circle cx="54" cy="54" r={r} fill="none" stroke={`${accent}2E`} strokeWidth="7" />
      <circle cx="54" cy="54" r={r} fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} transform="rotate(-90 54 54)" />
    </svg>
  )
}

function Stars({ count, of }: { count: number; of: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, color: '#B45309' }} role="img" aria-label={`${count} of ${of} stars`}>
      {Array.from({ length: of }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < count ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={i < count ? 0 : 1.6} aria-hidden="true">
          <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      ))}
    </div>
  )
}
