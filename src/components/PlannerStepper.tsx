import { Check } from 'lucide-react'

const PLANNER_STEPS = [
  { id: 'route', label: 'Route' },
  { id: 'constraints', label: 'Constraints' },
  { id: 'weather', label: 'Weather' },
  { id: 'review', label: 'Review & Check' },
] as const

type Props = {
  step: number
  maxReached: number
  onSelect: (index: number) => void
}

export function PlannerStepper({ step, maxReached, onSelect }: Props) {
  return (
    <ol className="grid grid-cols-4 gap-1 sm:gap-2">
      {PLANNER_STEPS.map((item, i) => {
        const done = i < step
        const current = i === step
        const reachable = i <= maxReached
        return (
          <li key={item.id}>
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onSelect(i)}
              className={`flex min-h-11 w-full items-center justify-center gap-1.5 rounded-2xl px-1.5 text-center transition sm:px-3 ${
                current
                  ? 'bg-teal text-white shadow-sm'
                  : done
                    ? 'bg-teal-soft text-teal-dark'
                    : 'bg-surface-raised text-ink-muted ring-1 ring-border'
              } ${reachable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                  current
                    ? 'bg-white/20 text-white'
                    : done
                      ? 'bg-teal text-white'
                      : 'bg-border text-ink-muted'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className="hidden truncate text-xs font-bold sm:inline sm:text-sm">
                {item.label}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
