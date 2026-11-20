import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { label: 'Learn', to: '/', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg> },
  { label: 'Paths', to: '/paths', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg> },
  { label: 'Review', to: '/review', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" /></svg> },
  { label: 'Progress', to: '/progress', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20V11M10 20V5M16 20v-6M2 20h20" /></svg> },
]

export function BottomNav() {
  const { pathname } = useLocation()
  function isActive(to: string) { return to === '/' ? pathname === '/' : pathname.startsWith(to) }
  return (
    <nav aria-label="Main" style={{ margin: '0 16px 20px', height: 64, borderRadius: 999, background: '#18181B', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', padding: '0 6px', alignItems: 'center', flexShrink: 0 }}>
      {tabs.map((tab) => {
        const active = isActive(tab.to)
        return (
          <Link key={tab.to} to={tab.to} aria-current={active ? 'page' : undefined} aria-label={active ? undefined : tab.label}
            style={{ height: 52, borderRadius: 999, background: active ? '#FFFFFF' : 'transparent', color: active ? '#18181B' : '#D4D4D8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
            {tab.icon}
            {active && <span>{tab.label}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
