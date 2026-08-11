import { Cloud } from 'lucide-react'
import { WEATHER_OPTIONS } from '../data/mock'
import type { WeatherId } from '../types'

type Props = {
  weatherId: WeatherId
  onChange: (id: WeatherId) => void
}

export function WeatherSelect({ weatherId, onChange }: Props) {
  return (
    <section className="rounded-3xl bg-surface-raised p-4 shadow-sm ring-1 ring-border sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Cloud className="h-5 w-5 text-teal" strokeWidth={2.4} aria-hidden />
        <h2 className="font-display text-lg font-bold text-ink">Weather</h2>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {WEATHER_OPTIONS.map((opt) => {
          const active = opt.id === weatherId
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`min-h-11 rounded-2xl border-2 px-3 py-2.5 text-sm font-bold transition ${
                active
                  ? opt.status === 'fail'
                    ? 'border-coral bg-coral-soft text-coral-dark'
                    : opt.status === 'caution'
                      ? 'border-amber bg-amber-soft text-ink'
                      : 'border-teal bg-teal-soft text-teal-dark'
                  : 'border-border bg-surface text-ink-muted hover:border-teal/40'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
