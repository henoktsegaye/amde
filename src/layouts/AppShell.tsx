import { useBreakpoint } from '../hooks/useBreakpoint'
import { DesktopShell } from './DesktopShell'
import { MobileShell } from './MobileShell'

export function AppShell() {
  const bp = useBreakpoint()
  return bp === 'desktop' ? <DesktopShell /> : <MobileShell />
}
