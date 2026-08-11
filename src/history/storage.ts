import type { DeliveryRecord } from './types'

const HISTORY_KEY = 'gagan.deliveries'

function readAll(): DeliveryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as DeliveryRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(records: DeliveryRecord[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export function getDeliveriesForUser(email: string): DeliveryRecord[] {
  return readAll()
    .filter((r) => r.userEmail === email.trim().toLowerCase())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** Saves a check unless the same fingerprint already exists for this user. */
export function saveDelivery(record: DeliveryRecord): DeliveryRecord | null {
  const all = readAll()
  const exists = all.some(
    (r) =>
      r.userEmail === record.userEmail && r.fingerprint === record.fingerprint,
  )
  if (exists) return null
  all.unshift(record)
  writeAll(all.slice(0, 200))
  return record
}

export type DeliveryStats = {
  total: number
  feasibleCount: number
  feasiblePct: number
  topFailure: string | null
}

export function computeDeliveryStats(records: DeliveryRecord[]): DeliveryStats {
  const total = records.length
  const feasibleCount = records.filter((r) => r.feasible).length
  const feasiblePct = total === 0 ? 0 : Math.round((feasibleCount / total) * 100)

  const failCounts = new Map<string, number>()
  for (const r of records) {
    if (r.feasible || !r.failureReason) continue
    failCounts.set(r.failureReason, (failCounts.get(r.failureReason) ?? 0) + 1)
  }

  let topFailure: string | null = null
  let topCount = 0
  for (const [reason, count] of failCounts) {
    if (count > topCount) {
      topCount = count
      topFailure = reason
    }
  }

  return { total, feasibleCount, feasiblePct, topFailure }
}
