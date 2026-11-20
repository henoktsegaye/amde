import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'

export function MobileShell() {
  return (
    <div style={{
      width: '100%',
      maxWidth: 480,
      minHeight: '100dvh',
      margin: '0 auto',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
