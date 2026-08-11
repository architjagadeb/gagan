import type { ReactNode } from 'react'
import {
  Battery,
  Check,
  Clock,
  Package,
  Route,
  ShieldAlert,
  X,
} from 'lucide-react'
import type { FeasibilityCheck, RouteMetrics } from '../types'

type Props = {
  metrics: RouteMetrics
  revealKey: string
}

function StatusIcon({ status }: { status: FeasibilityCheck['status'] }) {
  if (status === 'pass') {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-go-soft text-go">
        <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
      </span>
    )
  }
  if (status === 'caution') {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-soft text-amber">
        <ShieldAlert className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      </span>
    )
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-soft text-coral">
      <X className="h-4 w-4" strokeWidth={3} aria-hidden />
    </span>
  )
}

export function VerdictCard({ metrics, revealKey }: Props) {
  const go = metrics.feasible

  return (
    <section
      key={revealKey}
      className="animate-verdict-in overflow-hidden rounded-3xl shadow-sm ring-1 ring-border"
      aria-live="polite"
    >
      <div
        className={`px-4 py-5 sm:px-5 ${
          go ? 'bg-go text-white' : 'bg-coral text-white'
        }`}
      >
        <p className="text-sm font-semibold uppercase tracking-wider opacity-90">
          Verdict
        </p>
        <p className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {go ? 'Feasible' : 'Not Feasible'}
        </p>
        <p className="mt-1 text-sm font-medium opacity-95">
          {go
            ? 'All checks passed — clear to fly'
            : 'Fix the failed checks below before flying'}
        </p>
      </div>

      <div className="bg-surface-raised px-3 py-3 sm:px-4">
        <ul className="space-y-1.5">
          {metrics.checks.map((check, i) => (
            <li
              key={check.id}
              className="animate-check-pop flex items-start gap-3 rounded-2xl px-2 py-2"
              style={{ animationDelay: `${80 + i * 60}ms` }}
            >
              <StatusIcon status={check.status} />
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-bold text-ink">{check.label}</p>
                <p className="text-sm text-ink-muted">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 sm:grid-cols-4">
          <SummaryChip
            icon={<Route className="h-4 w-4" aria-hidden />}
            label="Distance"
            value={`${metrics.distanceKm} km`}
          />
          <SummaryChip
            icon={<Clock className="h-4 w-4" aria-hidden />}
            label="Flight time"
            value={`${metrics.flightMinutes} min`}
          />
          <SummaryChip
            icon={<Battery className="h-4 w-4" aria-hidden />}
            label="Battery left"
            value={`${metrics.remainingBattery}%`}
          />
          <SummaryChip
            icon={<Package className="h-4 w-4" aria-hidden />}
            label="Needs battery"
            value={`${metrics.requiredBattery}%`}
          />
        </div>
      </div>
    </section>
  )
}

function SummaryChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-surface px-3 py-2.5">
      <div className="mb-0.5 flex items-center gap-1 text-ink-muted">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-display text-base font-bold text-ink">{value}</p>
    </div>
  )
}
