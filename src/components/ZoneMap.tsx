import { Ban, MapPinned } from 'lucide-react'
import { MAP_SIZE, NO_FLY_ZONES, PRESET_ROUTES } from '../data/mock'
import type { Point } from '../types'

type Props = {
  routeId: string
  directPath: Point[]
  alternatePath: Point[] | null
  showAlternate: boolean
  zoneHitId: string | null
}

function pointsToSvg(path: Point[]): string {
  return path.map((p) => `${p.x},${p.y}`).join(' ')
}

export function ZoneMap({
  routeId,
  directPath,
  alternatePath,
  showAlternate,
  zoneHitId,
}: Props) {
  const route = PRESET_ROUTES.find((r) => r.id === routeId) ?? PRESET_ROUTES[0]

  return (
    <section className="overflow-hidden rounded-3xl bg-surface-raised shadow-sm ring-1 ring-border">
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2 sm:px-5">
        <div className="flex items-center gap-2">
          <MapPinned className="h-5 w-5 text-teal" strokeWidth={2.4} aria-hidden />
          <h2 className="font-display text-lg font-bold text-ink">Map</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
          <Ban className="h-3.5 w-3.5 text-coral" aria-hidden />
          No-fly zones
        </div>
      </div>

      <div className="relative mx-3 mb-3 aspect-[4/3] overflow-hidden rounded-2xl bg-map-land sm:mx-4 sm:mb-4 sm:aspect-[5/3]">
        <svg
          viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
          className="h-full w-full"
          role="img"
          aria-label={`Map showing route from ${route.pickupName} to ${route.dropName}`}
        >
          {/* Soft terrain blobs */}
          <ellipse cx="30" cy="25" rx="28" ry="18" fill="#d5ebe8" opacity="0.7" />
          <ellipse cx="75" cy="70" rx="24" ry="20" fill="#d5ebe8" opacity="0.55" />
          <ellipse cx="55" cy="45" rx="35" ry="28" fill="#dff0ed" opacity="0.45" />

          {/* Stylized roads */}
          <path
            d="M5 40 Q40 35 55 55 T95 50"
            fill="none"
            stroke="var(--color-map-road)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M20 5 Q35 40 40 95"
            fill="none"
            stroke="var(--color-map-road)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M5 75 Q50 68 90 80"
            fill="none"
            stroke="var(--color-map-road)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* No-fly zones */}
          {NO_FLY_ZONES.map((zone) => {
            const hit = zone.id === zoneHitId
            if (zone.kind === 'circle') {
              return (
                <g key={zone.id}>
                  <circle
                    cx={zone.center.x}
                    cy={zone.center.y}
                    r={zone.radius}
                    fill={hit ? 'rgba(232,93,76,0.35)' : 'rgba(232,93,76,0.18)'}
                    stroke={hit ? '#c94738' : '#e85d4c'}
                    strokeWidth={hit ? 0.7 : 0.45}
                    strokeDasharray={hit ? undefined : '1.2 0.8'}
                  />
                  <text
                    x={zone.center.x}
                    y={zone.center.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="2.4"
                    fontWeight="700"
                    fill="#c94738"
                    className="pointer-events-none"
                  >
                    {zone.name.split(' ')[0]}
                  </text>
                </g>
              )
            }

            const d =
              zone.points
                .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`)
                .join(' ') + ' Z'
            const cx =
              zone.points.reduce((s, p) => s + p.x, 0) / zone.points.length
            const cy =
              zone.points.reduce((s, p) => s + p.y, 0) / zone.points.length

            return (
              <g key={zone.id}>
                <path
                  d={d}
                  fill={hit ? 'rgba(232,93,76,0.35)' : 'rgba(232,93,76,0.18)'}
                  stroke={hit ? '#c94738' : '#e85d4c'}
                  strokeWidth={hit ? 0.7 : 0.45}
                  strokeDasharray={hit ? undefined : '1.2 0.8'}
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="2.2"
                  fontWeight="700"
                  fill="#c94738"
                >
                  Red Fort
                </text>
              </g>
            )
          })}

          {/* Direct route */}
          <polyline
            key={`direct-${routeId}-${directPath.map((p) => `${p.x}-${p.y}`).join(',')}`}
            points={pointsToSvg(directPath)}
            fill="none"
            stroke={zoneHitId ? '#e85d4c' : '#0b6e6e'}
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={zoneHitId ? '2 1.2' : undefined}
            pathLength={1}
            className="route-line-draw"
            opacity={showAlternate ? 0.45 : 1}
          />

          {/* Alternate route */}
          {showAlternate && alternatePath && (
            <polyline
              key={`alt-${alternatePath.map((p) => `${p.x}-${p.y}`).join(',')}`}
              points={pointsToSvg(alternatePath)}
              fill="none"
              stroke="#1a9b6c"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className="route-line-draw"
            />
          )}

          {/* Alternate waypoints */}
          {showAlternate &&
            alternatePath?.slice(1, -1).map((wp, i) => (
              <circle
                key={`wp-${i}`}
                cx={wp.x}
                cy={wp.y}
                r="1.4"
                fill="#1a9b6c"
                stroke="#fff"
                strokeWidth="0.5"
              />
            ))}

          {/* Pickup pin */}
          <g>
            <circle
              cx={route.pickup.x}
              cy={route.pickup.y}
              r="2.4"
              fill="#0b6e6e"
              stroke="#fff"
              strokeWidth="0.7"
            />
            <circle cx={route.pickup.x} cy={route.pickup.y} r="0.9" fill="#fff" />
          </g>

          {/* Drop pin */}
          <g>
            <circle
              cx={route.drop.x}
              cy={route.drop.y}
              r="2.4"
              fill="#e85d4c"
              stroke="#fff"
              strokeWidth="0.7"
            />
            <circle cx={route.drop.x} cy={route.drop.y} r="0.9" fill="#fff" />
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-2.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-teal shadow-sm ring-1 ring-border">
            ● Pickup
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-coral shadow-sm ring-1 ring-border">
            ● Drop
          </span>
          {showAlternate && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-go shadow-sm ring-1 ring-border">
              — Safe route
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
