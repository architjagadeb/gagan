import { ClipboardList, Percent, TriangleAlert } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  computeDeliveryStats,
  getDeliveriesForUser,
} from '../history/storage'
import type { DeliveryRecord } from '../history/types'

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function DashboardPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<DeliveryRecord[]>([])

  useEffect(() => {
    if (!user) {
      setRecords([])
      return
    }
    setRecords(getDeliveriesForUser(user.email))
  }, [user])

  const stats = computeDeliveryStats(records)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-5">
        <h1 className="font-display text-3xl font-extrabold text-ink">My Deliveries</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">
          Feasibility checks saved from the planner
        </p>
      </header>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={<ClipboardList className="h-5 w-5" aria-hidden />}
          label="Checks run"
          value={String(stats.total)}
        />
        <StatCard
          icon={<Percent className="h-5 w-5" aria-hidden />}
          label="Feasible"
          value={stats.total === 0 ? '—' : `${stats.feasiblePct}%`}
        />
        <StatCard
          icon={<TriangleAlert className="h-5 w-5" aria-hidden />}
          label="Top failure"
          value={stats.topFailure ?? '—'}
        />
      </div>

      {records.length === 0 ? (
        <div className="animate-verdict-in rounded-3xl bg-surface-raised px-5 py-10 text-center shadow-sm ring-1 ring-border">
          <p className="font-display text-xl font-bold text-ink">No checks yet</p>
          <p className="mt-1 text-sm font-medium text-ink-muted">
            Run a route in the planner — results show up here.
          </p>
          <Link
            to="/planner"
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-teal px-6 text-sm font-bold text-white hover:bg-teal-dark"
          >
            Open planner
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <li
              key={r.id}
              className="animate-verdict-in rounded-3xl bg-surface-raised p-4 shadow-sm ring-1 ring-border sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-ink">{r.routeLabel}</p>
                  <p className="text-sm font-medium text-ink-muted">
                    {r.pickupName} → {r.dropName}
                    {r.usedSafeRoute ? ' · Safe route' : ''}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-ink-muted">
                    {formatWhen(r.createdAt)} · {r.distanceKm} km · {r.flightMinutes} min
                  </p>
                </div>
                <span
                  className={`inline-flex min-h-9 items-center rounded-full px-3 text-xs font-bold text-white ${
                    r.feasible ? 'bg-go' : 'bg-coral'
                  }`}
                >
                  {r.feasible ? 'Feasible' : 'Not Feasible'}
                </span>
              </div>
              {!r.feasible && r.failureReason && (
                <p className="mt-3 rounded-2xl bg-coral-soft px-3 py-2 text-sm font-semibold text-coral-dark">
                  Failed: {r.failureReason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-3xl bg-surface-raised p-4 shadow-sm ring-1 ring-border">
      <div className="mb-2 flex items-center gap-2 text-teal">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
          {label}
        </span>
      </div>
      <p className="font-display text-2xl font-extrabold text-ink">{value}</p>
    </div>
  )
}
