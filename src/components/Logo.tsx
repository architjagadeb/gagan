import { Link } from 'react-router-dom'

type Props = {
  className?: string
}

export function Logo({ className = '' }: Props) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-[9px] text-[20px] font-bold tracking-[-0.3px] text-[var(--text-main)] ${className}`}
      style={{ fontFamily: 'var(--font-landing)' }}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center" aria-hidden>
        <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
          <rect width="32" height="32" rx="9" fill="var(--accent)" />
          <path
            d="M8 18c2.2-6.2 6.2-9.2 8-9.2s5.8 3 8 9.2"
            stroke="#F2FBFA"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <circle cx="16" cy="12.2" r="2.1" fill="#FF6B4A" />
          <path
            d="M11 21.2h10M13.2 24.2h5.6"
            stroke="#F2FBFA"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      </span>
      Gagan
    </Link>
  )
}
