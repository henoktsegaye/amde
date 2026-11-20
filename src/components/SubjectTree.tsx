import { Link, useParams } from 'react-router-dom'
import { aiEngineering } from '../data/content'
import { useProgress } from '../context/ProgressContext'
import { ProgressRing } from './ProgressRing'

export function SubjectTree() {
  const { nodeId: activeNodeId, sectionId: activeSectionId, lessonId: activeLessonId } = useParams()
  const { completedSections, readLessons } = useProgress()
  const accent = aiEngineering.accent
  const totalSections = aiEngineering.nodes.reduce((n, nd) => n + nd.sections.length, 0)
  const pct = totalSections > 0 ? Math.round((completedSections.length / totalSections) * 100) : 0

  return (
    <div style={{ width: 260, borderRight: '1px solid #ECECF0', display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0, background: '#fff' }}>
      {/* Subject header */}
      <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #ECECF0' }}>
        <ProgressRing pct={pct} size={40} stroke={4} accent={accent} label={`${pct}%`} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#18181B' }}>{aiEngineering.title}</div>
          <div style={{ fontSize: 12, color: '#6B6B76' }}>{completedSections.length}/{totalSections} sections done</div>
        </div>
      </div>

      {/* Tree — all nodes always visible */}
      <nav aria-label="Course structure" style={{ padding: '8px 0', flex: 1 }}>
        {aiEngineering.nodes.map((node) => {
          const nodeComplete = node.sections.every((s) => completedSections.includes(s.id))
          const nodeStarted = node.sections.some((s) =>
            s.lessons.some((l) => readLessons.includes(l.id)) || completedSections.includes(s.id)
          )
          const isActiveNode = node.id === activeNodeId

          return (
            <div key={node.id}>
              {/* Node header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px' }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                  background: nodeComplete ? '#E7F4EC' : nodeStarted ? `${accent}1A` : '#F5F5F7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {nodeComplete ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                  ) : (
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: nodeStarted ? accent : '#D4D4D8' }} />
                  )}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#18181B', flex: 1 }}>{node.title}</span>
                {nodeStarted && !nodeComplete && (
                  <span style={{ fontSize: 10, fontWeight: 600, color: accent, letterSpacing: '0.04em' }}>
                    {node.sections.filter((s) => completedSections.includes(s.id)).length}/{node.sections.length}
                  </span>
                )}
              </div>

              {/* Sections + lessons — always expanded */}
              <div style={{ marginLeft: 28, paddingLeft: 16, borderLeft: `2px solid ${isActiveNode ? `${accent}40` : '#ECECF0'}` }}>
                {node.sections.map((section) => {
                  const sectionDone = completedSections.includes(section.id)
                  const isActiveSection = section.id === activeSectionId

                  return (
                    <div key={section.id} style={{ marginBottom: 2 }}>
                      {/* Section row */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '5px 8px', borderRadius: 6,
                        background: isActiveSection && !activeLessonId ? '#F5F5F7' : 'transparent',
                      }}>
                        {sectionDone ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                        ) : (
                          <span style={{ width: 13, flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: 12, fontWeight: 600, color: sectionDone ? '#6B6B76' : '#18181B', letterSpacing: '0.01em' }}>
                          {section.title}
                        </span>
                      </div>

                      {/* Lessons */}
                      {section.lessons.map((lesson) => {
                        const isCurrentLesson = lesson.id === activeLessonId && section.id === activeSectionId
                        const lessonRead = readLessons.includes(lesson.id)

                        return (
                          <Link
                            key={lesson.id}
                            to={`/ai-engineering/${node.id}/${section.id}/${lesson.id}`}
                            aria-current={isCurrentLesson ? 'page' : undefined}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              minHeight: 34, padding: '0 8px', borderRadius: 6,
                              background: isCurrentLesson ? `${accent}18` : 'transparent',
                              fontSize: 12, color: isCurrentLesson ? '#18181B' : '#3F3F46',
                              fontWeight: isCurrentLesson ? 600 : 400,
                              marginLeft: 6,
                            }}
                          >
                            {lessonRead ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                            ) : isCurrentLesson ? (
                              <span style={{ width: 5, height: 5, borderRadius: 999, background: accent, flexShrink: 0 }} />
                            ) : (
                              <span style={{ width: 12, flexShrink: 0 }} />
                            )}
                            <span style={{ flex: 1, lineHeight: 1.3 }}>{lesson.title}</span>
                            <span style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>{lesson.minutes}m</span>
                          </Link>
                        )
                      })}

                      {/* Quiz row */}
                      <Link
                        to={`/ai-engineering/${node.id}/${section.id}/quiz`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          minHeight: 34, padding: '0 8px', borderRadius: 6,
                          fontSize: 12, color: '#6B6B76', marginLeft: 6,
                          background: activeSectionId === section.id && activeLessonId === 'quiz' ? `${accent}18` : 'transparent',
                        }}
                      >
                        {sectionDone ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                        ) : (
                          <span style={{ width: 12, flexShrink: 0 }} />
                        )}
                        <span style={{ color: sectionDone ? '#6B6B76' : '#18181B', fontWeight: 500 }}>Section quiz</span>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
