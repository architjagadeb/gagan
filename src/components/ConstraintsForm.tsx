import { Battery, Package, Plane } from 'lucide-react'
import { DRONE_PROFILES } from '../data/mock'
import type { DroneProfileId } from '../types'

type Props = {
  weightKg: number
  batteryPct: number
  droneId: DroneProfileId
  onWeightChange: (v: number) => void
  onBatteryChange: (v: number) => void
  onDroneChange: (v: DroneProfileId) => void
}

export function ConstraintsForm({
  weightKg,
  batteryPct,
  droneId,
  onWeightChange,
  onBatteryChange,
  onDroneChange,
}: Props) {
  return (
    <section className="rounded-3xl bg-surface-raised p-4 shadow-sm ring-1 ring-border sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Package className="h-5 w-5 text-teal" strokeWidth={2.4} aria-hidden />
        <h2 className="font-display text-lg font-bold text-ink">Drone & package</h2>
      </div>

      <div className="mb-4">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-muted">
          <Plane className="h-4 w-4" aria-hidden />
          Drone profile
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DRONE_PROFILES.map((drone) => {
            const active = drone.id === droneId
            return (
              <button
                key={drone.id}
                type="button"
                onClick={() => onDroneChange(drone.id)}
                className={`min-h-11 rounded-2xl border-2 px-3 py-2.5 text-left transition ${
                  active
                    ? 'border-teal bg-teal-soft text-ink'
                    : 'border-border bg-surface text-ink-muted hover:border-teal/40'
                }`}
              >
                <span className="block text-sm font-bold">{drone.name}</span>
                <span className="block text-xs font-medium">
                  {drone.maxPayloadKg} kg · {drone.maxRangeKm} km
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <label className="mb-4 block">
        <span className="mb-1.5 flex items-center justify-between text-sm font-semibold text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Package className="h-4 w-4" aria-hidden />
            Package weight
          </span>
          <span className="font-bold text-ink">{weightKg.toFixed(1)} kg</span>
        </span>
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.1}
          value={weightKg}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          className="h-3 w-full cursor-pointer appearance-none rounded-full bg-border accent-teal"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-muted">
          <span>0.5 kg</span>
          <span>5 kg max</span>
        </div>
      </label>

      <label className="block">
        <span className="mb-1.5 flex items-center justify-between text-sm font-semibold text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Battery className="h-4 w-4" aria-hidden />
            Battery
          </span>
          <span className="font-bold text-ink">{batteryPct}%</span>
        </span>
        <input
          type="range"
          min={10}
          max={100}
          step={1}
          value={batteryPct}
          onChange={(e) => onBatteryChange(Number(e.target.value))}
          className="h-3 w-full cursor-pointer appearance-none rounded-full bg-border accent-teal"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-muted">
          <span>10%</span>
          <span>100%</span>
        </div>
      </label>
    </section>
  )
}
