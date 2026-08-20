import { Link } from 'react-router-dom'

type Props = {
  arrowSize?: 24 | 32
  className?: string
  onClick?: () => void
}

export function CheckDeliveryCta({
  arrowSize = 24,
  className = '',
  onClick,
}: Props) {
  return (
    <Link
      to="/planner"
      onClick={onClick}
      className={`check-delivery-cta group inline-flex items-center gap-2.5 rounded-[40px] py-[5px] pr-4 pl-[5px] text-[13px] font-medium text-white no-underline ${className}`}
    >
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-white"
        style={{ width: arrowSize, height: arrowSize }}
        aria-hidden
      >
        <svg
          width={arrowSize === 32 ? 16 : 14}
          height={arrowSize === 32 ? 16 : 14}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 6l6 6-6 6"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      Check a Delivery
    </Link>
  )
}
