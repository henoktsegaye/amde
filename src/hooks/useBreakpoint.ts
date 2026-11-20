import { useState, useEffect } from 'react'

export type Breakpoint = 'mobile' | 'desktop'

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window !== 'undefined' && window.innerWidth >= 900 ? 'desktop' : 'mobile'
  )

  useEffect(() => {
    const handler = () => setBp(window.innerWidth >= 900 ? 'desktop' : 'mobile')
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return bp
}
