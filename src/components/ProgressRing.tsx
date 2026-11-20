interface Props { pct: number; size?: number; stroke?: number; accent: string; label?: string }

export function ProgressRing({ pct, size = 48, stroke = 5, accent, label }: Props) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const cx = size / 2
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${pct}% complete`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#ECECF0" strokeWidth={stroke} />
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={accent} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`}
          transform={`rotate(-90 ${cx} ${cx})`} />
      </svg>
      {label && (
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size < 60 ? 11 : 13, fontWeight: 700 }}>
          {label}
        </span>
      )}
    </div>
  )
}
