import type { NoFlyZone, Point } from '../types'

export function distance(a: Point, b: Point): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.hypot(dx, dy)
}

export function pathLength(points: Point[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += distance(points[i - 1], points[i])
  }
  return total
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

/** Closest point on segment AB to point P */
function closestOnSegment(p: Point, a: Point, b: Point): Point {
  const abx = b.x - a.x
  const aby = b.y - a.y
  const len2 = abx * abx + aby * aby
  if (len2 === 0) return a
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / len2))
  return { x: a.x + t * abx, y: a.y + t * aby }
}

function segmentHitsCircle(a: Point, b: Point, center: Point, radius: number): boolean {
  const closest = closestOnSegment(center, a, b)
  return distance(closest, center) <= radius
}

function orient(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
}

function onSegment(a: Point, b: Point, c: Point): boolean {
  return (
    Math.min(a.x, b.x) <= c.x &&
    c.x <= Math.max(a.x, b.x) &&
    Math.min(a.y, b.y) <= c.y &&
    c.y <= Math.max(a.y, b.y)
  )
}

function segmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  const o1 = orient(a, b, c)
  const o2 = orient(a, b, d)
  const o3 = orient(c, d, a)
  const o4 = orient(c, d, b)

  if (o1 * o2 < 0 && o3 * o4 < 0) return true
  if (o1 === 0 && onSegment(a, b, c)) return true
  if (o2 === 0 && onSegment(a, b, d)) return true
  if (o3 === 0 && onSegment(c, d, a)) return true
  if (o4 === 0 && onSegment(c, d, b)) return true
  return false
}

function pointInPolygon(p: Point, poly: Point[]): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x
    const yi = poly[i].y
    const xj = poly[j].x
    const yj = poly[j].y
    const intersect =
      yi > p.y !== yj > p.y &&
      p.x < ((xj - xi) * (p.y - yi)) / (yj - yi || Number.EPSILON) + xi
    if (intersect) inside = !inside
  }
  return inside
}

function segmentHitsPolygon(a: Point, b: Point, poly: Point[]): boolean {
  if (pointInPolygon(a, poly) || pointInPolygon(b, poly)) return true
  for (let i = 0; i < poly.length; i++) {
    const c = poly[i]
    const d = poly[(i + 1) % poly.length]
    if (segmentsIntersect(a, b, c, d)) return true
  }
  return false
}

export function pathHitsZone(path: Point[], zone: NoFlyZone): boolean {
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]
    const b = path[i]
    if (zone.kind === 'circle') {
      if (segmentHitsCircle(a, b, zone.center, zone.radius)) return true
    } else if (segmentHitsPolygon(a, b, zone.points)) {
      return true
    }
  }
  return false
}

export function findIntersectingZone(
  path: Point[],
  zones: NoFlyZone[],
): NoFlyZone | null {
  for (const zone of zones) {
    if (pathHitsZone(path, zone)) return zone
  }
  return null
}

function zoneCentroid(zone: NoFlyZone): Point {
  if (zone.kind === 'circle') return zone.center
  const n = zone.points.length
  const sum = zone.points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 },
  )
  return { x: sum.x / n, y: sum.y / n }
}

function zoneClearance(zone: NoFlyZone): number {
  if (zone.kind === 'circle') return zone.radius + 4
  let maxR = 0
  const c = zoneCentroid(zone)
  for (const p of zone.points) {
    maxR = Math.max(maxR, distance(c, p))
  }
  return maxR + 4
}

/**
 * Build a simple offset waypoint around the blocking zone.
 * Tries both sides of the route and picks the shorter clear path.
 */
export function buildAlternatePath(
  pickup: Point,
  drop: Point,
  zones: NoFlyZone[],
  blocking: NoFlyZone,
): Point[] {
  const center = zoneCentroid(blocking)
  const clearance = zoneClearance(blocking)
  const dx = drop.x - pickup.x
  const dy = drop.y - pickup.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len

  const candidates: Point[] = [
    { x: center.x + nx * clearance, y: center.y + ny * clearance },
    { x: center.x - nx * clearance, y: center.y - ny * clearance },
    {
      x: center.x + nx * clearance * 1.35,
      y: center.y + ny * clearance * 1.35,
    },
    {
      x: center.x - nx * clearance * 1.35,
      y: center.y - ny * clearance * 1.35,
    },
  ]

  let best: Point[] | null = null
  let bestLen = Infinity

  for (const wp of candidates) {
    const clamped = {
      x: Math.max(2, Math.min(98, wp.x)),
      y: Math.max(2, Math.min(98, wp.y)),
    }
    const path = [pickup, clamped, drop]
    if (findIntersectingZone(path, zones)) continue
    const lenPath = pathLength(path)
    if (lenPath < bestLen) {
      bestLen = lenPath
      best = path
    }
  }

  // Fallback: push further out even if still imperfect
  if (!best) {
    const fallback = {
      x: Math.max(2, Math.min(98, center.x + nx * clearance * 1.8)),
      y: Math.max(2, Math.min(98, center.y + ny * clearance * 1.8)),
    }
    best = [pickup, fallback, drop]
  }

  return best
}
