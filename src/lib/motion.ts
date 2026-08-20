import type { Point } from '../types'
import { distance } from './geometry'

export function pointAlongPath(
  points: Point[],
  t: number,
): { point: Point; angle: number } {
  if (points.length === 0) return { point: { x: 0, y: 0 }, angle: 0 }
  if (points.length === 1) return { point: points[0], angle: 0 }

  const clamped = Math.max(0, Math.min(1, t))
  const segs: number[] = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const len = distance(points[i - 1], points[i])
    segs.push(len)
    total += len
  }
  if (total === 0) return { point: points[0], angle: 0 }

  let remain = clamped * total
  for (let i = 0; i < segs.length; i++) {
    const a = points[i]
    const b = points[i + 1]
    const len = segs[i]
    if (remain <= len || i === segs.length - 1) {
      const u = len === 0 ? 0 : Math.min(1, remain / len)
      const dx = b.x - a.x
      const dy = b.y - a.y
      return {
        point: { x: a.x + dx * u, y: a.y + dy * u },
        angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      }
    }
    remain -= len
  }

  const last = points[points.length - 1]
  const prev = points[points.length - 2]
  return {
    point: last,
    angle: (Math.atan2(last.y - prev.y, last.x - prev.x) * 180) / Math.PI,
  }
}
