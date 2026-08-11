import { MapPin } from 'lucide-react'
import { PRESET_ROUTES } from '../data/mock'

type Props = {
  routeId: string
  onChange: (routeId: string) => void
}

export function RoutePlanner({ routeId, onChange }: Props) {
  const selected = PRESET_ROUTES.find((r) => r.id === routeId) ?? PRESET_ROUTES[0]

  return (
    <section className="rounded-3xl bg-surface-raised p-4 shadow-sm ring-1 ring-border sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-teal" strokeWidth={2.4} aria-hidden />
        <h2 className="font-display text-lg font-bold text-ink">Route</h2>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink-muted">
          Pickup → Drop-off
        </span>
        <select
          value={routeId}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-11 w-full appearance-none rounded-2xl border-2 border-border bg-surface px-4 py-2.5 text-base font-semibold text-ink outline-none transition focus:border-teal"
        >
          {PRESET_ROUTES.map((route) => (
            <option key={route.id} value={route.id}>
              {route.label}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-teal-soft px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">
            Pickup
          </p>
          <p className="text-sm font-bold text-ink">{selected.pickupName}</p>
        </div>
        <div className="rounded-2xl bg-coral-soft px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-coral">
            Drop
          </p>
          <p className="text-sm font-bold text-ink">{selected.dropName}</p>
        </div>
      </div>
    </section>
  )
}
