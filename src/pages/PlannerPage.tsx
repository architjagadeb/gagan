import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AlternatePathCompare } from '../components/AlternatePathCompare'
import { ConstraintsForm } from '../components/ConstraintsForm'
import { RoutePlanner } from '../components/RoutePlanner'
import { VerdictCard } from '../components/VerdictCard'
import { WeatherSelect } from '../components/WeatherSelect'
import { ZoneMap } from '../components/ZoneMap'
import { PRESET_ROUTES } from '../data/mock'
import { saveDelivery } from '../history/storage'
import { evaluateFeasibility } from '../lib/feasibility'
import type { DroneProfileId, WeatherId } from '../types'

export function PlannerPage() {
  const { user, isAuthenticated } = useAuth()
  const [routeId, setRouteId] = useState(PRESET_ROUTES[0].id)
  const [weightKg, setWeightKg] = useState(1.5)
  const [batteryPct, setBatteryPct] = useState(80)
  const [droneId, setDroneId] = useState<DroneProfileId>(
    () => user?.preferredDroneId ?? 'standard',
  )
  const [weatherId, setWeatherId] = useState<WeatherId>('clear')
  const [preferSafe, setPreferSafe] = useState(true)
  const lastSaved = useRef<string | null>(null)

  useEffect(() => {
    if (user?.preferredDroneId) setDroneId(user.preferredDroneId)
  }, [user?.preferredDroneId])

  const result = useMemo(
    () =>
      evaluateFeasibility({
        routeId,
        weightKg,
        batteryPct,
        droneId,
        weatherId,
      }),
    [routeId, weightKg, batteryPct, droneId, weatherId],
  )

  const showAlternate =
    Boolean(result.alternate) && preferSafe && Boolean(result.direct.zoneHit)

  const activeMetrics =
    showAlternate && result.alternate ? result.alternate : result.direct

  const revealKey = [
    routeId,
    weightKg,
    batteryPct,
    droneId,
    weatherId,
    showAlternate ? 'safe' : 'direct',
  ].join('|')

  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (lastSaved.current === revealKey) return

    const timer = window.setTimeout(() => {
      const failed = activeMetrics.checks.find((c) => c.status === 'fail')
      saveDelivery({
        id: crypto.randomUUID(),
        userEmail: user.email,
        routeId,
        routeLabel: result.routeLabel,
        pickupName: result.pickupName,
        dropName: result.dropName,
        feasible: activeMetrics.feasible,
        distanceKm: activeMetrics.distanceKm,
        flightMinutes: activeMetrics.flightMinutes,
        requiredBattery: activeMetrics.requiredBattery,
        droneId,
        weatherId,
        failureReason: failed?.label ?? null,
        usedSafeRoute: showAlternate,
        createdAt: new Date().toISOString(),
        fingerprint: `${user.email}|${revealKey}`,
      })
      lastSaved.current = revealKey
    }, 700)

    return () => window.clearTimeout(timer)
  }, [
    isAuthenticated,
    user,
    revealKey,
    activeMetrics,
    routeId,
    result.routeLabel,
    result.pickupName,
    result.dropName,
    droneId,
    weatherId,
    showAlternate,
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col pb-10">
      <header className="px-4 pt-5 pb-2 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Route planner
        </h1>
        <p className="text-sm font-medium text-ink-muted">
          Can this drone delivery fly?
          {!isAuthenticated && (
            <>
              {' '}
              <Link to="/login" className="font-bold text-teal underline-offset-2 hover:underline">
                Log in
              </Link>{' '}
              to save checks to your dashboard.
            </>
          )}
        </p>
      </header>

      <main className="grid flex-1 gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-5">
        <div className="flex flex-col gap-4">
          <RoutePlanner routeId={routeId} onChange={setRouteId} />
          <ZoneMap
            routeId={routeId}
            directPath={result.direct.path}
            alternatePath={result.alternate?.path ?? null}
            showAlternate={showAlternate}
            zoneHitId={result.direct.zoneHit?.id ?? null}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ConstraintsForm
            weightKg={weightKg}
            batteryPct={batteryPct}
            droneId={droneId}
            onWeightChange={setWeightKg}
            onBatteryChange={setBatteryPct}
            onDroneChange={setDroneId}
          />
          <WeatherSelect weatherId={weatherId} onChange={setWeatherId} />
          <VerdictCard metrics={activeMetrics} revealKey={revealKey} />

          {result.alternate && result.direct.zoneHit && (
            <>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl bg-teal-soft px-4 py-3 ring-1 ring-teal/20">
                <input
                  type="checkbox"
                  checked={preferSafe}
                  onChange={(e) => setPreferSafe(e.target.checked)}
                  className="h-5 w-5 accent-teal"
                />
                <span className="text-sm font-bold text-teal-dark">
                  Use suggested safe route on map & verdict
                </span>
              </label>
              <AlternatePathCompare
                direct={result.direct}
                alternate={result.alternate}
                zoneName={result.direct.zoneHit.name}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
