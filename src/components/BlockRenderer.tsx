import type { Block } from '../data/content'

const accent = '#6A5AE0'

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#3F3F46' }}>{block.body}</p>

    case 'callout':
      return (
        <div style={{ display: 'flex', gap: 12, padding: 16, borderRadius: 16, background: `${accent}12` }}>
          <svg style={{ flexShrink: 0, color: accent, marginTop: 1 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" />
          </svg>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#18181B' }}>{block.body}</p>
        </div>
      )

    case 'code':
      return (
        <div style={{ borderRadius: 12, background: '#18181B', overflow: 'hidden' }}>
          <div style={{ padding: '6px 14px', background: '#2a2a2a', fontSize: 11, color: '#6B6B76', fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{block.lang}</div>
          <pre style={{ margin: 0, padding: '14px 16px', overflowX: 'auto', fontSize: 13, lineHeight: 1.6, color: '#E2E2E2', fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace' }}>
            <code>{block.body}</code>
          </pre>
        </div>
      )

    case 'steps':
      return (
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, padding: 14, borderRadius: 16, background: '#F5F5F7', alignItems: 'flex-start' }}>
              <span style={{ width: 32, height: 32, borderRadius: 999, background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </span>
              <span>
                <strong style={{ display: 'block', fontSize: 15, color: '#18181B' }}>{item.title}</strong>
                <span style={{ fontSize: 14, color: '#6B6B76', lineHeight: 1.5 }}>{item.body}</span>
              </span>
            </li>
          ))}
        </ol>
      )

    case 'compare':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[block.left, block.right].map((side, i) => (
            <div key={i} style={{
              padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 10,
              background: i === 1 ? `${accent}0F` : '#F5F5F7',
              border: i === 1 ? `2px solid ${accent}40` : '2px solid transparent',
            }}>
              <strong style={{ fontSize: 14, color: '#18181B' }}>{side.title}</strong>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {side.points.map((p, j) => (
                  <li key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#3F3F46', lineHeight: 1.4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 999, background: i === 1 ? accent : '#D4D4D8', flexShrink: 0, marginTop: 5 }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
  }
}
