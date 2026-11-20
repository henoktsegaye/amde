import { useState } from 'react'
import { Link } from 'react-router-dom'
import { aiEngineering, nodeIsUnlocked } from '../data/content'
import { useProgress } from '../context/ProgressContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { ProgressRing } from '../components/ProgressRing'

const accent = '#6A5AE0'

type NodeState = 'locked' | 'available' | 'in-progress' | 'complete'

function getNodeState(nodeId: string, completedSections: string[], readLessons: string[]): NodeState {
  const node = aiEngineering.nodes.find((n) => n.id === nodeId)
  if (!node) return 'locked'
  if (!nodeIsUnlocked(nodeId, completedSections)) return 'locked'
  const allSectionsDone = node.sections.every((s) => completedSections.includes(s.id))
  if (allSectionsDone) return 'complete'
  const anyStarted = node.sections.some((s) => s.lessons.some((l) => readLessons.includes(l.id)))
  if (anyStarted) return 'in-progress'
  return 'available'
}

const stateStyle: Record<NodeState, React.CSSProperties> = {
  locked:      { background: '#F5F5F7', border: '2px dashed #D4D4D8', opacity: 0.65, cursor: 'default' },
  available:   { background: '#fff',    border: '1.5px solid #ECECF0', cursor: 'pointer' },
  'in-progress': { background: `${accent}0D`, border: `2px solid ${accent}`, cursor: 'pointer' },
  complete:    { background: '#E7F4EC', border: '1.5px solid #CDE9D7', cursor: 'pointer' },
}

const stateLabel: Record<NodeState, { text: string; color: string; bg: string }> = {
  locked:        { text: 'Locked',      color: '#6B6B76', bg: '#ECECF0' },
  available:     { text: 'Available',   color: '#6B6B76', bg: '#F5F5F7' },
  'in-progress': { text: 'In progress', color: accent,    bg: `${accent}18` },
  complete:      { text: 'Complete',    color: '#15803D', bg: '#E7F4EC' },
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export function SubjectPage() {
  const bp = useBreakpoint()
  const { completedSections, readLessons } = useProgress()
  const total = aiEngineering.nodes.reduce((s, n) => s + n.sections.length, 0)
  const pct = total > 0 ? Math.round((completedSections.length / total) * 100) : 0

  return bp === 'desktop'
    ? <DesktopRoadmap completedSections={completedSections} readLessons={readLessons} pct={pct} />
    : <MobileRoadmap  completedSections={completedSections} readLessons={readLessons} pct={pct} />
}

// ─── Desktop — DAG flowchart + side panel ─────────────────────────────────────

function DesktopRoadmap({ completedSections, readLessons, pct }: { completedSections: string[]; readLessons: string[]; pct: number }) {
  const [selected, setSelected] = useState<string | null>(aiEngineering.nodes[0]?.id ?? null)
  const selectedNode = aiEngineering.nodes.find((n) => n.id === selected)

  // Build column layout from prereq graph
  // Column 0: nodes with no prereqs
  // Column N: nodes whose deepest prereq is in column N-1
  const colOf: Record<string, number> = {}
  function assignCol(id: string, visited = new Set<string>()): number {
    if (colOf[id] !== undefined) return colOf[id]
    if (visited.has(id)) return 0
    visited.add(id)
    const node = aiEngineering.nodes.find((n) => n.id === id)
    if (!node || node.prereqs.length === 0) { colOf[id] = 0; return 0 }
    const col = Math.max(...node.prereqs.map((p) => assignCol(p, visited) + 1))
    colOf[id] = col
    return col
  }
  aiEngineering.nodes.forEach((n) => assignCol(n.id))
  const maxCol = Math.max(...Object.values(colOf), 0)

  const cols: string[][] = Array.from({ length: maxCol + 1 }, () => [])
  aiEngineering.nodes.forEach((n) => cols[colOf[n.id] ?? 0].push(n.id))

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* Left: flowchart */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 32px 40px 48px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <ProgressRing pct={pct} size={48} stroke={5} accent={accent} label={`${pct}%`} />
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#18181B', letterSpacing: '-0.02em' }}>{aiEngineering.title}</h1>
              <p style={{ margin: 0, fontSize: 14, color: '#6B6B76' }}>{aiEngineering.description}</p>
            </div>
          </div>
        </div>

        {/* DAG columns */}
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
          {cols.map((colNodeIds, colIdx) => (
            <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 180 }}>
              {colNodeIds.map((nodeId) => {
                const node = aiEngineering.nodes.find((n) => n.id === nodeId)!
                const state = getNodeState(nodeId, completedSections, readLessons)
                const isSelected = selected === nodeId
                const doneSections = node.sections.filter((s) => completedSections.includes(s.id)).length

                return (
                  <div key={nodeId} style={{ position: 'relative' }}>
                    {/* Connector arrow to next column */}
                    {colIdx < maxCol && node.prereqs.length === 0 && (
                      <div style={{ position: 'absolute', right: -32, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 0, zIndex: 1 }}>
                        <div style={{ width: 24, height: 2, background: '#D4D4D8' }} />
                        <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true">
                          <path d="M0 0 L8 5 L0 10 Z" fill="#D4D4D8" />
                        </svg>
                      </div>
                    )}

                    <button
                      disabled={state === 'locked'}
                      onClick={() => state !== 'locked' && setSelected(nodeId)}
                      style={{
                        width: '100%', textAlign: 'left', borderRadius: 16, padding: '14px 16px',
                        display: 'flex', flexDirection: 'column', gap: 10,
                        outline: isSelected ? `3px solid ${accent}` : 'none',
                        outlineOffset: 2,
                        transition: 'all 0.15s',
                        ...stateStyle[state],
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: state === 'locked' ? '#6B6B76' : '#18181B', lineHeight: 1.3 }}>
                          {node.title}
                        </span>
                        <StateIcon state={state} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: '#6B6B76' }}>
                          {doneSections}/{node.sections.length} sections
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                          background: stateLabel[state].bg, color: stateLabel[state].color,
                        }}>
                          {stateLabel[state].text}
                        </span>
                      </div>
                      {/* Mini progress bar */}
                      <div style={{ height: 4, borderRadius: 999, background: state === 'locked' ? '#ECECF0' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                        <div style={{ width: `${node.sections.length > 0 ? (doneSections / node.sections.length) * 100 : 0}%`, height: '100%', borderRadius: 999, background: state === 'complete' ? '#15803D' : accent, transition: 'width 0.3s' }} />
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 40, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {(['available', 'in-progress', 'complete', 'locked'] as NodeState[]).map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: stateLabel[s].bg, border: `1px solid ${stateLabel[s].color}40` }} />
              <span style={{ fontSize: 12, color: '#6B6B76' }}>{stateLabel[s].text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: detail panel */}
      <div style={{ width: 320, borderLeft: '1px solid #ECECF0', overflowY: 'auto', padding: '40px 32px 40px 28px', background: '#faf9f5', flexShrink: 0 }}>
        {selectedNode ? (
          <NodeDetail node={selectedNode} completedSections={completedSections} readLessons={readLessons} />
        ) : (
          <div style={{ color: '#6B6B76', fontSize: 14, marginTop: 40, textAlign: 'center' }}>
            Select a topic to see its sections
          </div>
        )}
      </div>
    </div>
  )
}

function NodeDetail({ node, completedSections, readLessons }: { node: typeof aiEngineering.nodes[0]; completedSections: string[]; readLessons: string[] }) {
  const state = getNodeState(node.id, completedSections, readLessons)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <StateIcon state={state} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#18181B' }}>{node.title}</h2>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#6B6B76', lineHeight: 1.5 }}>
          {node.sections.length} sections · {node.sections.reduce((s, sec) => s + sec.lessons.length, 0)} lessons
        </p>
      </div>

      {node.prereqs.length > 0 && state === 'locked' && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: '#FFF7ED', border: '1px solid #FED7AA', fontSize: 13, color: '#92400E' }}>
          Complete <strong>{node.prereqs.map((p) => aiEngineering.nodes.find((n) => n.id === p)?.title ?? p).join(' & ')}</strong> first
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {node.sections.map((section) => {
          const done = completedSections.includes(section.id)
          const started = section.lessons.some((l) => readLessons.includes(l.id))
          const firstLesson = section.lessons[0]

          return (
            <Link
              key={section.id}
              to={state !== 'locked' ? `/ai-engineering/${node.id}/${section.id}/${firstLesson.id}` : '#'}
              style={{
                display: 'flex', flexDirection: 'column', gap: 8,
                padding: '14px 16px', borderRadius: 14,
                background: done ? '#E7F4EC' : started ? `${accent}09` : '#fff',
                border: `1px solid ${done ? '#CDE9D7' : started ? `${accent}30` : '#ECECF0'}`,
                pointerEvents: state === 'locked' ? 'none' : 'auto',
                opacity: state === 'locked' ? 0.5 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                ) : (
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: started ? accent : '#D4D4D8', flexShrink: 0 }} />
                )}
                <span style={{ fontSize: 14, fontWeight: 600, color: done ? '#15803D' : '#18181B', flex: 1 }}>{section.title}</span>
              </div>
              <span style={{ fontSize: 12, color: '#6B6B76', marginLeft: 22 }}>
                {section.lessons.length} lessons + quiz
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ─── Mobile — subway-map accordion ────────────────────────────────────────────

function MobileRoadmap({ completedSections, readLessons, pct }: { completedSections: string[]; readLessons: string[]; pct: number }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 8px', flexShrink: 0 }}>
        <Link to="/" aria-label="Back" style={{ width: 44, height: 44, borderRadius: 999, background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: '#18181B' }}>{aiEngineering.title}</div>
          <div style={{ fontSize: 13, color: '#6B6B76' }}>{aiEngineering.nodes.length} topics</div>
        </div>
        <ProgressRing pct={pct} size={44} stroke={4} accent={accent} label={`${pct}%`} />
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 32px' }}>
        {aiEngineering.nodes.map((node, idx) => {
          const state = getNodeState(node.id, completedSections, readLessons)
          const isOpen = openId === node.id
          const isLast = idx === aiEngineering.nodes.length - 1
          const doneSections = node.sections.filter((s) => completedSections.includes(s.id)).length

          return (
            <div key={node.id} style={{ display: 'flex', gap: 0 }}>
              {/* Left: timeline line + circle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 999, flexShrink: 0, marginTop: 10,
                  background: state === 'complete' ? '#15803D' : state === 'in-progress' ? accent : state === 'available' ? '#fff' : '#F5F5F7',
                  border: state === 'locked' ? '2px dashed #D4D4D8' : state === 'available' ? '2px solid #ECECF0' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <StateIconMobile state={state} />
                </div>
                {!isLast && (
                  <div style={{ flex: 1, width: 2, minHeight: 16, background: state === 'complete' ? '#15803D' : state === 'in-progress' ? `${accent}60` : '#ECECF0', marginTop: 2 }} />
                )}
              </div>

              {/* Right: node card */}
              <div style={{ flex: 1, paddingBottom: isLast ? 0 : 8, paddingTop: 4, minWidth: 0 }}>
                <button
                  disabled={state === 'locked'}
                  onClick={() => setOpenId(isOpen ? null : node.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 14,
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: state === 'in-progress' ? `${accent}0D` : state === 'complete' ? '#E7F4EC' : '#fff',
                    border: `1px solid ${state === 'in-progress' ? `${accent}40` : state === 'complete' ? '#CDE9D7' : '#ECECF0'}`,
                    opacity: state === 'locked' ? 0.6 : 1,
                    cursor: state === 'locked' ? 'default' : 'pointer',
                    marginLeft: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: state === 'locked' ? '#6B6B76' : '#18181B' }}>{node.title}</div>
                    <div style={{ fontSize: 12, color: '#6B6B76', marginTop: 2 }}>
                      {state === 'locked'
                        ? `Finish ${node.prereqs.map((p) => aiEngineering.nodes.find((n) => n.id === p)?.title ?? p).join(' & ')} first`
                        : `${doneSections}/${node.sections.length} sections`}
                    </div>
                  </div>
                  {state !== 'locked' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  )}
                </button>

                {/* Expanded sections */}
                {isOpen && (
                  <div style={{ marginTop: 6, marginLeft: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {node.sections.map((section) => {
                      const done = completedSections.includes(section.id)
                      const started = section.lessons.some((l) => readLessons.includes(l.id))
                      return (
                        <Link
                          key={section.id}
                          to={`/ai-engineering/${node.id}/${section.id}/${section.lessons[0].id}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '12px 14px', borderRadius: 12,
                            background: done ? '#E7F4EC' : started ? `${accent}09` : '#F5F5F7',
                            border: `1px solid ${done ? '#CDE9D7' : started ? `${accent}25` : '#ECECF0'}`,
                          }}
                        >
                          {done ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                          ) : (
                            <span style={{ width: 7, height: 7, borderRadius: 999, background: started ? accent : '#D4D4D8', flexShrink: 0 }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: done ? '#15803D' : '#18181B' }}>{section.title}</div>
                            <div style={{ fontSize: 12, color: '#6B6B76' }}>{section.lessons.length} lessons + quiz</div>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4D4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function StateIcon({ state }: { state: NodeState }) {
  if (state === 'complete') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label="Complete" role="img"><path d="m5 12 5 5 9-10" /></svg>
  )
  if (state === 'locked') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4D4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Locked" role="img"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
  )
  if (state === 'in-progress') return (
    <span style={{ width: 8, height: 8, borderRadius: 999, background: accent, display: 'block' }} aria-label="In progress" role="img" />
  )
  return <span style={{ width: 8, height: 8, borderRadius: 999, background: '#D4D4D8', display: 'block' }} aria-label="Available" role="img" />
}

function StateIconMobile({ state }: { state: NodeState }) {
  if (state === 'complete') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
  )
  if (state === 'locked') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4D4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
  )
  if (state === 'in-progress') return (
    <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fff', display: 'block' }} />
  )
  return <span style={{ width: 7, height: 7, borderRadius: 999, background: '#D4D4D8', display: 'block' }} />
}
