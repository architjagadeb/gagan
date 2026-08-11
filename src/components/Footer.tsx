import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-raised/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg font-extrabold text-ink">Gagan</p>
          <p className="text-sm text-ink-muted">Drone delivery feasibility planner</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink-muted">
          <a href="/#how-it-works" className="min-h-11 inline-flex items-center hover:text-ink">
            About
          </a>
          <a href="mailto:hello@gagan.demo" className="min-h-11 inline-flex items-center hover:text-ink">
            Contact
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="min-h-11 inline-flex items-center hover:text-ink"
          >
            GitHub
          </a>
          <Link to="/planner" className="min-h-11 inline-flex items-center hover:text-ink">
            Planner
          </Link>
        </div>
      </div>
    </footer>
  )
}
