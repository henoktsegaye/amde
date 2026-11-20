interface Props { size?: number }

export function AmdeLogoIcon({ size = 32 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Amde logo">
      <rect width="32" height="32" rx="10" fill="#18181B" />
      <path d="M8 12 L11 7 L14 12 V23.5 Q14 25 12.5 25 H9.5 Q8 25 8 23.5 Z"
        fill="#BCB5F1" stroke="#BCB5F1" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M18 12 L21 7 L24 12 V23.5 Q24 25 22.5 25 H19.5 Q18 25 18 23.5 Z"
        fill="#FCEFC0" stroke="#FCEFC0" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  )
}
