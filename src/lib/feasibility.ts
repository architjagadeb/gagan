import {
  DRONE_PROFILES,
  KM_PER_MAP_UNIT,
  NO_FLY_ZONES,
  PRESET_ROUTES,
  WEATHER_OPTIONS,
} from '../data/mock'
import type {
  DroneProfileId,
  FeasibilityCheck,
  NoFlyZone,
  PlannerInput,
  Point,
  RouteMetrics,
  WeatherId,
} from '../types'
import {
  buildAlternatePath,
  findIntersectingZone,
  pathLength,
} from './geometry'

function getDrone(id: DroneProfileId) {
  return DRONE_PROFILES.find((d) => d.id === id) ?? DRONE_PROFILES[0]
}

function getWeather(id: WeatherId) {
  return WEATHER_OPTIONS.find((w) => w.id === id) ?? WEATHER_OPTIONS[0]
}

export function getRoute(routeId: string) {
  return PRESET_ROUTES.find((r) => r.id === routeId) ?? PRESET_ROUTES[0]
}

export function requiredBatteryPct(
  distanceKm: number,
  weightKg: number,
  droneId: DroneProfileId,
): number {
  const drone = getDrone(droneId)
  const drainPerKm =
    drone.baseDrainPerKm + weightKg * drone.payloadDrainPerKmPerKg
  const raw = distanceKm * drainPerKm + 8 // 8% reserve
  return Math.min(100, Math.ceil(raw))
}

function evaluatePath(
  path: Point[],
  input: PlannerInput,
  zones: NoFlyZone[] = NO_FLY_ZONES,
): RouteMetrics {
  const drone = getDrone(input.droneId)
  const weather = getWeather(input.weatherId)
  const mapUnits = pathLength(path)
  const distanceKm = Math.round(mapUnits * KM_PER_MAP_UNIT * 10) / 10
  const flightMinutes = Math.max(
    1,
    Math.round((distanceKm / drone.cruiseSpeedKmh) * 60),
  )
  const required = requiredBatteryPct(distanceKm, input.weightKg, input.droneId)
  const remaining = input.batteryPct - required
  const zoneHit = findIntersectingZone(path, zones)

  const checks: FeasibilityCheck[] = [
    {
      id: 'zone',
      label: 'No-fly zones',
      status: zoneHit ? 'fail' : 'pass',
      detail: zoneHit
        ? `Crosses ${zoneHit.name}`
        : 'Clear of restricted airspace',
    },
    {
      id: 'payload',
      label: 'Payload limit',
      status: input.weightKg <= drone.maxPayloadKg ? 'pass' : 'fail',
      detail:
        input.weightKg <= drone.maxPayloadKg
          ? `${input.weightKg} kg within ${drone.maxPayloadKg} kg max`
          : `${input.weightKg} kg exceeds ${drone.maxPayloadKg} kg max`,
    },
    {
      id: 'range',
      label: 'Drone range',
      status: distanceKm <= drone.maxRangeKm ? 'pass' : 'fail',
      detail:
        distanceKm <= drone.maxRangeKm
          ? `${distanceKm} km within ${drone.maxRangeKm} km range`
          : `${distanceKm} km exceeds ${drone.maxRangeKm} km range`,
    },
    {
      id: 'battery',
      label: 'Battery',
      status: remaining >= 0 ? 'pass' : 'fail',
      detail:
        remaining >= 0
          ? `Needs ${required}% — ${remaining}% left after flight`
          : `Needs ${required}% — short by ${Math.abs(remaining)}%`,
    },
    {
      id: 'weather',
      label: 'Weather',
      status: weather.status,
      detail: weather.note,
    },
  ]

  const hardFails = checks.filter((c) => c.status === 'fail')
  const feasible = hardFails.length === 0

  return {
    path,
    distanceKm,
    flightMinutes,
    requiredBattery: required,
    remainingBattery: remaining,
    zoneHit,
    feasible,
    checks,
  }
}

export type FeasibilityResult = {
  direct: RouteMetrics
  alternate: RouteMetrics | null
  routeLabel: string
  pickupName: string
  dropName: string
}

export function evaluateFeasibility(input: PlannerInput): FeasibilityResult {
  const route = getRoute(input.routeId)
  const directPath = [route.pickup, route.drop]
  const direct = evaluatePath(directPath, input)

  let alternate: RouteMetrics | null = null
  if (direct.zoneHit) {
    const altPath = buildAlternatePath(
      route.pickup,
      route.drop,
      NO_FLY_ZONES,
      direct.zoneHit,
    )
    alternate = evaluatePath(altPath, input)
  }

  return {
    direct,
    alternate,
    routeLabel: route.label,
    pickupName: route.pickupName,
    dropName: route.dropName,
  }
}
