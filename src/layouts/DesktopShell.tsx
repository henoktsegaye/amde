import { Link, Outlet, useLocation } from 'react-router-dom'
import { AmdeLogoIcon } from '../components/AmdeLogo'
import { SubjectTree } from '../components/SubjectTree'

const navItems = [
  { label: 'Learn', to: '/', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg> },
  { label: 'Paths', to: '/paths', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg> },
  { label: 'Review', to: '/review', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" /></svg> },
  { label: 'Progress', to: '/progress', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20V11M10 20V5M16 20v-6M2 20h20" /></svg> },
]

export function DesktopShell() {
  const { pathname } = useLocation()
  const inSubject = pathname.startsWith('/ai-engineering')

  function isActive(to: string) { return to === '/' ? pathname === '/' : pathname.startsWith(to) }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#faf9f5' }}>
      {/* Left icon nav */}
      <nav
        aria-label="Main"
        style={{
          width: 60, flexShrink: 0, background: '#18181B',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '16px 0', gap: 4, position: 'sticky', top: 0, height: '100dvh',
        }}
      >
        <Link to="/" aria-label="Home" style={{ marginBottom: 16 }}>
          <AmdeLogoIcon size={32} />
        </Link>
        {navItems.map((item) => {
          const active = isActive(item.to)
          return (
            <Link
              key={item.to} to={item.to} aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              style={{
                width: 44, height: 44, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: active ? '#18181B' : '#6B6B76',
                background: active ? '#FFFFFF' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {item.icon}
            </Link>
          )
        })}
      </nav>

      {/* Subject tree sidebar (only inside /ai-engineering) */}
      {inSubject && <SubjectTree />}

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto', background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  )
}
