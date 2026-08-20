import { jsPDF } from 'jspdf'
import { DRONE_PROFILES, WEATHER_OPTIONS } from '../data/mock'
import type { FeasibilityResult } from './feasibility'
import type { DroneProfileId, WeatherId } from '../types'

type ReportInput = {
  result: FeasibilityResult
  usedSafeRoute: boolean
  weightKg: number
  batteryPct: number
  droneId: DroneProfileId
  weatherId: WeatherId
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

function stamp() {
  return new Date().toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function reportFileName(routeLabel: string) {
  const day = new Date().toISOString().slice(0, 10)
  return `gagan-feasibility-report-${slug(routeLabel) || day}.pdf`
}

export function downloadFeasibilityReport({
  result,
  usedSafeRoute,
  weightKg,
  batteryPct,
  droneId,
  weatherId,
}: ReportInput) {
  const metrics = usedSafeRoute && result.alternate ? result.alternate : result.direct
  const drone = DRONE_PROFILES.find((d) => d.id === droneId) ?? DRONE_PROFILES[0]
  const weather = WEATHER_OPTIONS.find((w) => w.id === weatherId) ?? WEATHER_OPTIONS[0]
  const go = metrics.feasible

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  let y = 18

  doc.setFillColor(11, 110, 110)
  doc.roundedRect(16, 12, 10, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('G', 21, 18.6, { align: 'center' })

  doc.setTextColor(15, 28, 30)
  doc.setFontSize(18)
  doc.text('Gagan', 30, 19)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(61, 82, 86)
  doc.text('Drone Delivery Feasibility Report', 30, 24)

  y = 34
  doc.setDrawColor(213, 228, 226)
  doc.line(16, y, pageW - 16, y)
  y += 10

  const verdictColor = go ? [26, 155, 108] : [232, 93, 76]
  doc.setFillColor(verdictColor[0], verdictColor[1], verdictColor[2])
  doc.roundedRect(16, y, pageW - 32, 22, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('VERDICT', 22, y + 8)
  doc.setFontSize(20)
  doc.text(go ? 'Feasible' : 'Not Feasible', 22, y + 17)
  y += 32

  doc.setTextColor(15, 28, 30)
  doc.setFontSize(12)
  doc.text('Route', 16, y)
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(61, 82, 86)
  const rows: [string, string][] = [
    ['Pickup', result.pickupName],
    ['Drop-off', result.dropName],
    ['Route', result.routeLabel],
    ['Distance', `${metrics.distanceKm} km${usedSafeRoute ? ' (safe route)' : ''}`],
    ['Flight time', `${metrics.flightMinutes} min`],
    ['Drone', `${drone.name} · ${drone.maxPayloadKg} kg max · ${drone.maxRangeKm} km range`],
    ['Payload', `${weightKg.toFixed(1)} kg`],
    ['Battery entered', `${batteryPct}%`],
    ['Battery required', `${metrics.requiredBattery}%`],
    ['Battery remaining', `${metrics.remainingBattery}%`],
    ['Weather', `${weather.label} — ${weather.note}`],
  ]
  for (const [label, value] of rows) {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 28, 30)
    doc.text(label, 16, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(61, 82, 86)
    doc.text(value, 62, y)
    y += 6
  }

  y += 4
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 28, 30)
  doc.setFontSize(12)
  doc.text('Checks', 16, y)
  y += 8

  doc.setFontSize(10)
  for (const check of metrics.checks) {
    const mark = check.status === 'fail' ? 'X' : check.status === 'caution' ? '!' : 'OK'
    const color =
      check.status === 'fail'
        ? [201, 71, 56]
        : check.status === 'caution'
          ? [232, 163, 23]
          : [26, 155, 108]
    doc.setFillColor(color[0], color[1], color[2])
    doc.roundedRect(16, y - 4, 12, 6, 1, 1, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.text(mark, 22, y, { align: 'center' })
    doc.setFontSize(10)
    doc.setTextColor(15, 28, 30)
    doc.text(`${check.label}: ${check.detail}`, 32, y)
    y += 7
  }

  if (result.alternate && result.direct.zoneHit) {
    y += 4
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Route comparison', 16, y)
    y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(61, 82, 86)
    doc.text(
      `Direct: ${result.direct.distanceKm} km · ${result.direct.requiredBattery}% battery · ${
        result.direct.feasible ? 'Feasible' : 'Blocked'
      } (hits ${result.direct.zoneHit.name})`,
      16,
      y,
    )
    y += 6
    doc.text(
      `Safe: ${result.alternate.distanceKm} km · ${result.alternate.requiredBattery}% battery · ${
        result.alternate.feasible ? 'Feasible' : 'Blocked'
      }`,
      16,
      y,
    )
    y += 8
  }

  doc.setDrawColor(213, 228, 226)
  doc.line(16, 277, pageW - 16, 277)
  doc.setFontSize(8)
  doc.setTextColor(136, 136, 136)
  doc.text(
    `Generated by Gagan — Drone Delivery Feasibility Planner  ·  ${stamp()}`,
    16,
    283,
  )

  doc.save(reportFileName(result.routeLabel))
}
