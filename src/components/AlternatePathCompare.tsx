import { ArrowRightLeft, Check, X } from 'lucide-react'
import type { RouteMetrics } from '../types'

type Props = {
  direct: RouteMetrics
  alternate: RouteMetrics
  zoneName: string
}

export function AlternatePathCompare({ direct, alternate, zoneName }: Props) {
  return (
    <section className="animate-verdict-in rounded-3xl bg-surface-raised p-4 shadow-sm ring-1 ring-border sm:p-5">
      <div className="mb-1 flex items-center gap-2">
        <ArrowRightLeft className="h-5 w-5 text-teal" strokeWidth={2.4} aria-hidden />
        <h2 className="font-display text-lg font-bold text-ink">
          Safe route suggested
        </h2>
      </div>
      <p className="mb-4 text-sm text-ink-muted">
        Direct path hits <span className="font-semibold text-coral">{zoneName}</span>.
        Here&apos;s a detour that clears it.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <CompareCard title="Direct Route" metrics={direct} tone="danger" />
        <CompareCard title="Safe Route" metrics={alternate} tone="safe" />
      </div>
    </section>
  )
}

function CompareCard({
  title,
  metrics,
  tone,
}: {
  title: string
  metrics: RouteMetrics
  tone: 'danger' | 'safe'
}) {
  const ok = metrics.feasible
  return (
    <div
      className={`rounded-2xl border-2 p-3.5 ${
        tone === 'safe'
          ? 'border-go/40 bg-go-soft/40'
          : 'border-coral/40 bg-coral-soft/40'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-base font-bold text-ink">{title}</h3>
        <span
          className={`inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 text-xs font-bold ${
            ok ? 'bg-go text-white' : 'bg-coral text-white'
          }`}
        >
          {ok ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <X className="h-3.5 w-3.5" strokeWidth={3} />}
          {ok ? 'Feasible' : 'Blocked'}
        </span>
      </div>

      <dl className="space-y-2 text-sm">
        <Row label="Distance" value={`${metrics.distanceKm} km`} />
        <Row label="Flight time" value={`${metrics.flightMinutes} min`} />
        <Row label="Battery needed" value={`${metrics.requiredBattery}%`} />
        <Row
          label="Battery left"
          value={`${metrics.remainingBattery}%`}
          warn={metrics.remainingBattery < 0}
        />
      </dl>
    </div>
  )
}

function Row({
  label,
  value,
  warn,
}: {
  label: string
  value: string
  warn?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="font-medium text-ink-muted">{label}</dt>
      <dd className={`font-bold ${warn ? 'text-coral' : 'text-ink'}`}>{value}</dd>
    </div>
  )
}
