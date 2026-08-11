import type { DroneProfileId, WeatherId } from '../types'

export type DeliveryRecord = {
  id: string
  userEmail: string
  routeId: string
  routeLabel: string
  pickupName: string
  dropName: string
  feasible: boolean
  distanceKm: number
  flightMinutes: number
  requiredBattery: number
  droneId: DroneProfileId
  weatherId: WeatherId
  failureReason: string | null
  usedSafeRoute: boolean
  createdAt: string
  /** Dedupes live planner re-renders of the same check */
  fingerprint: string
}
