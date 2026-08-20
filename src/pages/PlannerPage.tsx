import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AlternatePathCompare } from '../components/AlternatePathCompare'
import { ConstraintsForm } from '../components/ConstraintsForm'
import { PlannerStepper } from '../components/PlannerStepper'
import { RoutePlanner } from '../components/RoutePlanner'
import { VerdictCard } from '../components/VerdictCard'
import { WeatherSelect } from '../components/WeatherSelect'
import { ZoneMap } from '../components/ZoneMap'
import { DRONE_PROFILES, PRESET_ROUTES, WEATHER_OPTIONS } from '../data/mock'
import { saveDelivery } from '../history/storage'
import { evaluateFeasibility } from '../lib/feasibility'
import { downloadFeasibilityReport } from '../lib/reportPdf'
import type { DroneProfileId, WeatherId } from '../types'

const CHECK_MS = 2200
const CHECK_STATUSES = [
  'Checking no-fly zones...',
  'Calculating battery range...',
  'Checking weather conditions...',
]

type Phase = 'form' | 'checking' | 'result'

export function PlannerPage() {
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [phase, setPhase] = useState<Phase>('form')
  const [flyProgress, setFlyProgress] = useState<number | null>(null)
  const [statusIndex, setStatusIndex] = useState(0)
  const [downloading, setDownloading] = useState(false)

  const [routeId, setRouteId] = useState(PRESET_ROUTES[0].id)
  const [weightKg, setWeightKg] = useState(1.5)
  const [batteryPct, setBatteryPct] = useState(80)
  const [droneId, setDroneId] = useState<DroneProfileId>(
    () => user?.preferredDroneId ?? 'standard',
  )
  const [weatherId, setWeatherId] = useState<WeatherId>('clear')
  const [preferSafe, setPreferSafe] = useState(true)
  const lastSaved = useRef<string | null>(null)
  const skipRef = useRef(false)

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
    phase === 'result' &&
    Boolean(result.alternate) &&
    preferSafe &&
    Boolean(result.direct.zoneHit)

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

  const goToStep = (next: number) => {
    setPhase('form')
    setFlyProgress(null)
    setStep(next)
    setMaxReached((m) => Math.max(m, next))
  }

  const canNext = step === 0 ? Boolean(routeId) : step === 1 ? weightKg > 0 && batteryPct > 0 : step === 2 ? Boolean(weatherId) : true

  const runCheck = () => {
    skipRef.current = false
    setStatusIndex(0)
    setFlyProgress(0)
    setPhase('checking')
  }

  const finishCheck = () => {
    skipRef.current = true
    setFlyProgress(1)
    setPhase('result')
  }

  useEffect(() => {
    if (phase !== 'checking') return
    skipRef.current = false
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      if (skipRef.current) return
      const t = Math.min(1, (now - start) / CHECK_MS)
      setFlyProgress(t)
      setStatusIndex(Math.min(CHECK_STATUSES.length - 1, Math.floor(t * CHECK_STATUSES.length)))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setPhase('result')
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  useEffect(() => {
    if (phase !== 'result' || !isAuthenticated || !user) return
    if (lastSaved.current === revealKey) return

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
  }, [
    phase,
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

  const onDownload = async () => {
    setDownloading(true)
    try {
      await new Promise((r) => setTimeout(r, 280))
      downloadFeasibilityReport({
        result,
        usedSafeRoute: showAlternate,
        weightKg,
        batteryPct,
        droneId,
        weatherId,
      })
    } finally {
      setDownloading(false)
    }
  }

  const drone = DRONE_PROFILES.find((d) => d.id === droneId) ?? DRONE_PROFILES[0]
  const weather = WEATHER_OPTIONS.find((w) => w.id === weatherId) ?? WEATHER_OPTIONS[0]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col pb-10">
      <header className="px-4 pt-5 pb-3 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Route planner
        </h1>
        <p className="mb-4 text-sm font-medium text-ink-muted">
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
        <PlannerStepper step={step} maxReached={maxReached} onSelect={goToStep} />
      </header>

      <main className="grid flex-1 gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-5">
        <div
          className="flex flex-col gap-3"
          onClick={phase === 'checking' ? finishCheck : undefined}
        >
          <ZoneMap
            routeId={routeId}
            directPath={result.direct.path}
            alternatePath={result.alternate?.path ?? null}
            showAlternate={showAlternate}
            zoneHitId={
              phase === 'result' ? (result.direct.zoneHit?.id ?? null) : null
            }
            flightProgress={phase === 'checking' ? flyProgress : null}
          />
          {phase === 'checking' && (
            <div className="rounded-2xl bg-surface-raised px-4 py-3 text-center shadow-sm ring-1 ring-border">
              <p className="text-sm font-bold text-teal">{CHECK_STATUSES[statusIndex]}</p>
              <button
                type="button"
                onClick={finishCheck}
                className="mt-1 text-xs font-semibold text-ink-muted underline-offset-2 hover:underline"
              >
                Skip
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {phase === 'checking' && (
            <button
              type="button"
              onClick={finishCheck}
              className="min-h-11 rounded-3xl bg-surface-raised px-4 py-8 text-center shadow-sm ring-1 ring-border"
            >
              <p className="font-display text-lg font-bold text-ink">Flying the route…</p>
              <p className="mt-1 text-sm text-ink-muted">{CHECK_STATUSES[statusIndex]}</p>
              <p className="mt-3 text-xs font-semibold text-teal">Tap anywhere to skip</p>
            </button>
          )}

          {phase === 'form' && step === 0 && (
            <RoutePlanner
              routeId={routeId}
              onChange={(id) => {
                setRouteId(id)
                setPhase('form')
              }}
              distanceKm={result.direct.distanceKm}
              flightMinutes={result.direct.flightMinutes}
            />
          )}

          {phase === 'form' && step === 1 && (
            <ConstraintsForm
              weightKg={weightKg}
              batteryPct={batteryPct}
              droneId={droneId}
              onWeightChange={setWeightKg}
              onBatteryChange={setBatteryPct}
              onDroneChange={setDroneId}
            />
          )}

          {phase === 'form' && step === 2 && (
            <WeatherSelect weatherId={weatherId} onChange={setWeatherId} />
          )}

          {phase === 'form' && step === 3 && (
            <section className="rounded-3xl bg-surface-raised p-4 shadow-sm ring-1 ring-border sm:p-5">
              <h2 className="font-display text-lg font-bold text-ink">Review & Check</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Confirm the plan, then run the feasibility check.
              </p>
              <dl className="mt-4 space-y-2.5 text-sm">
                <ReviewRow label="Route" value={result.routeLabel} />
                <ReviewRow
                  label="Distance"
                  value={`${result.direct.distanceKm} km · ${result.direct.flightMinutes} min`}
                />
                <ReviewRow label="Drone" value={`${drone.name} · ${weightKg.toFixed(1)} kg`} />
                <ReviewRow label="Battery" value={`${batteryPct}%`} />
                <ReviewRow label="Weather" value={weather.label} />
              </dl>
              <button
                type="button"
                onClick={runCheck}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-teal text-base font-bold text-white hover:bg-teal-dark"
              >
                Run Feasibility Check
              </button>
            </section>
          )}

          {phase === 'form' && (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => goToStep(step - 1)}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-2xl border-2 border-border bg-surface-raised text-sm font-bold text-ink disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Back
              </button>
              {step < 3 && (
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => goToStep(step + 1)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-2xl bg-teal text-sm font-bold text-white hover:bg-teal-dark disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          )}

          {phase === 'result' && (
            <>
              <VerdictCard
                metrics={activeMetrics}
                revealKey={revealKey}
                onDownload={onDownload}
                downloading={downloading}
              />

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

              <button
                type="button"
                onClick={() => goToStep(0)}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border-2 border-border bg-surface-raised text-sm font-bold text-ink"
              >
                Edit plan
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-2.5">
      <dt className="font-medium text-ink-muted">{label}</dt>
      <dd className="text-right font-bold text-ink">{value}</dd>
    </div>
  )
}
