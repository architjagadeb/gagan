# Gagan — Drone Delivery Feasibility Planner

Plan a drone delivery route and get an instant **Go / No-Go** verdict.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Mock data + localStorage auth (no real backend)

## Run

```bash
npm install
npm run dev
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing |
| `/planner` | Feasibility planner |
| `/login`, `/signup` | Mock auth |
| `/dashboard` | Delivery history (auth required) |
| `/profile` | Account + preferred drone (auth required) |

## Project layout

- `src/data/mock.ts` — routes, zones, drones, weather
- `src/lib/` — geometry + feasibility engine
- `src/components/` — planner UI + Navbar / layout
- `src/pages/` — landing, planner, auth, dashboard, profile
- `src/auth/` — localStorage auth context
- `src/history/` — saved delivery checks
