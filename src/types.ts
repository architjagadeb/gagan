/** Shared domain types — swap mock data later without changing components. */

export type Point = { x: number; y: number }

export type CircleZone = {
  id: string
  name: string
  kind: 'circle'
  center: Point
  radius: number
}

export type PolygonZone = {
  id: string
  name: string
  kind: 'polygon'
  points: Point[]
}

export type NoFlyZone = CircleZone | PolygonZone

export type DroneProfileId = 'standard' | 'heavy'

export type DroneProfile = {
  id: DroneProfileId
  name: string
  maxPayloadKg: number
  maxRangeKm: number
  /** Battery % consumed per km at empty payload */
  baseDrainPerKm: number
  /** Extra battery % per km per kg of payload */
  payloadDrainPerKmPerKg: number
  cruiseSpeedKmh: number
}

export type WeatherId = 'clear' | 'rain' | 'high_wind' | 'storm'

export type WeatherOption = {
  id: WeatherId
  label: string
  status: 'pass' | 'caution' | 'fail'
  note: string
}

export type PresetRoute = {
  id: string
  label: string
  pickup: Point
  drop: Point
  pickupName: string
  dropName: string
}

export type CheckStatus = 'pass' | 'fail' | 'caution'

export type FeasibilityCheck = {
  id: 'zone' | 'battery' | 'payload' | 'weather' | 'range'
  label: string
  status: CheckStatus
  detail: string
}

export type RouteMetrics = {
  path: Point[]
  distanceKm: number
  flightMinutes: number
  requiredBattery: number
  remainingBattery: number
  zoneHit: NoFlyZone | null
  feasible: boolean
  checks: FeasibilityCheck[]
}

export type PlannerInput = {
  routeId: string
  weightKg: number
  batteryPct: number
  droneId: DroneProfileId
  weatherId: WeatherId
}
