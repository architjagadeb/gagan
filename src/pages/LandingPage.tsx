import { CheckCircle2, MapPinned, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NO_FLY_ZONES } from '../data/mock'
import { Footer } from '../components/Footer'

const steps = [
  {
    icon: MapPinned,
    title: 'Set route',
    line: 'Pick pickup and drop on the map',
  },
  {
    icon: ShieldCheck,
    title: 'Check constraints',
    line: 'Weight, battery, weather, zones',
  },
  {
    icon: CheckCircle2,
    title: 'Get verdict',
    line: 'Clear Feasible or Not Feasible',
  },
]

export function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <section className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
        <div
          className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full bg-teal/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-coral/15 blur-3xl"
          aria-hidden
        />

        <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-teal">
          Gagan
        </p>
        <h1 className="max-w-xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Know if a drone delivery can fly — before it takes off
        </h1>
        <p className="mt-4 max-w-lg text-lg font-medium text-ink-muted">
          Check routes, no-fly zones, battery, and weather in one simple screen.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/planner"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-teal px-6 text-base font-bold text-white shadow-sm transition hover:bg-teal-dark"
          >
            Check a Delivery
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-border bg-surface-raised px-6 text-base font-bold text-ink transition hover:border-teal/40"
          >
            How it works
          </a>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.75rem] bg-teal shadow-sm">
          <div className="grid gap-0 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 text-white sm:p-8">
              <p className="font-display text-2xl font-extrabold sm:text-3xl">
                Go / No-Go in seconds
              </p>
              <p className="mt-2 max-w-sm text-sm font-medium text-white/85">
                Big verdict card. Clear checklist. Safe detour when a zone blocks the path.
              </p>
            </div>
            <div className="flex items-end justify-center bg-teal-dark/30 px-6 pb-0 pt-6">
              <div className="w-full max-w-xs translate-y-2 rounded-t-3xl bg-go px-5 py-6 text-white shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                  Verdict
                </p>
                <p className="font-display text-3xl font-extrabold">Feasible</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-border bg-surface-raised/60 py-10"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-extrabold text-ink">How it works</h2>
          <p className="mt-1 text-sm font-medium text-ink-muted">Three steps. No clutter.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className="rounded-3xl bg-surface-raised p-5 shadow-sm ring-1 ring-border"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-soft text-teal">
                      <Icon className="h-5 w-5" strokeWidth={2.4} aria-hidden />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                      Step {i + 1}
                    </span>
                  </div>
                  <p className="font-display text-lg font-bold text-ink">{step.title}</p>
                  <p className="mt-1 text-sm font-medium text-ink-muted">{step.line}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 sm:grid-cols-2 sm:px-6">
          <div className="rounded-3xl bg-surface-raised px-5 py-5 shadow-sm ring-1 ring-border">
            <p className="font-display text-3xl font-extrabold text-teal">
              {NO_FLY_ZONES.length}
            </p>
            <p className="text-sm font-semibold text-ink-muted">zones mapped</p>
          </div>
          <div className="rounded-3xl bg-surface-raised px-5 py-5 shadow-sm ring-1 ring-border">
            <p className="font-display text-3xl font-extrabold text-coral">Demo</p>
            <p className="text-sm font-semibold text-ink-muted">build — mock data only</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
