import type { DroneProfile, NoFlyZone, PresetRoute, WeatherOption } from '../types'

/** Map coordinate space: 0–100 in both axes (Delhi NCR stylized). */
export const MAP_SIZE = 100

export const NO_FLY_ZONES: NoFlyZone[] = [
  {
    id: 'igi',
    name: 'IGI Airport Perimeter',
    kind: 'circle',
    center: { x: 18, y: 72 },
    radius: 11,
  },
  {
    id: 'aiims',
    name: 'AIIMS Hospital Zone',
    kind: 'circle',
    center: { x: 52, y: 48 },
    radius: 7,
  },
  {
    id: 'red-fort',
    name: 'Red Fort Restricted Area',
    kind: 'polygon',
    points: [
      { x: 62, y: 22 },
      { x: 72, y: 20 },
      { x: 74, y: 30 },
      { x: 66, y: 34 },
      { x: 60, y: 28 },
    ],
  },
  {
    id: 'parliament',
    name: 'Parliament Complex',
    kind: 'circle',
    center: { x: 48, y: 32 },
    radius: 5.5,
  },
  {
    id: 'rashtrapati',
    name: 'Rashtrapati Bhavan Zone',
    kind: 'circle',
    center: { x: 40, y: 36 },
    radius: 5,
  },
]

export const DRONE_PROFILES: DroneProfile[] = [
  {
    id: 'standard',
    name: 'Standard',
    maxPayloadKg: 2,
    maxRangeKm: 10,
    baseDrainPerKm: 6,
    payloadDrainPerKmPerKg: 1.2,
    cruiseSpeedKmh: 45,
  },
  {
    id: 'heavy',
    name: 'Heavy-lift',
    maxPayloadKg: 5,
    maxRangeKm: 6,
    baseDrainPerKm: 9,
    payloadDrainPerKmPerKg: 1.5,
    cruiseSpeedKmh: 35,
  },
]

export const WEATHER_OPTIONS: WeatherOption[] = [
  {
    id: 'clear',
    label: 'Clear',
    status: 'pass',
    note: 'Safe flying conditions',
  },
  {
    id: 'rain',
    label: 'Rain',
    status: 'caution',
    note: 'Fly with caution — wet rotors',
  },
  {
    id: 'high_wind',
    label: 'High Wind',
    status: 'fail',
    note: 'Winds exceed safe limits',
  },
  {
    id: 'storm',
    label: 'Storm',
    status: 'fail',
    note: 'Do not fly — storm active',
  },
]

export const PRESET_ROUTES: PresetRoute[] = [
  {
    id: 'saket-nehru',
    label: 'Saket → Nehru Place',
    pickupName: 'Saket',
    dropName: 'Nehru Place',
    pickup: { x: 58, y: 78 },
    drop: { x: 72, y: 62 },
  },
  {
    id: 'cp-karol',
    label: 'Connaught Place → Karol Bagh',
    pickupName: 'Connaught Place',
    dropName: 'Karol Bagh',
    pickup: { x: 52, y: 18 },
    drop: { x: 34, y: 22 },
  },
  {
    id: 'south-aiims',
    label: 'South Ext. → Safdarjung',
    pickupName: 'South Extension',
    dropName: 'Safdarjung',
    pickup: { x: 54, y: 58 },
    drop: { x: 46, y: 42 },
  },
  {
    id: 'dwarka-igi',
    label: 'Dwarka → Aerocity',
    pickupName: 'Dwarka',
    dropName: 'Aerocity',
    pickup: { x: 5, y: 55 },
    drop: { x: 32, y: 78 },
  },
  {
    id: 'chandni-ig',
    label: 'Chandni Chowk → India Gate',
    pickupName: 'Chandni Chowk',
    dropName: 'India Gate',
    pickup: { x: 68, y: 18 },
    drop: { x: 54, y: 34 },
  },
]

/** Rough km scale: map units → km for demo realism */
export const KM_PER_MAP_UNIT = 0.18
