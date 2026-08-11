import { Menu, Plane, UserRound, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold transition ${
    isActive
      ? 'bg-teal-soft text-teal-dark'
      : 'text-ink-muted hover:bg-surface hover:text-ink'
  }`

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const menuId = useId()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!dropdownOpen) return
    const onPointer = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [dropdownOpen])

  const initials = user
    ? user.name
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('')
    : ''

  return (
    <nav className="sticky top-0 z-40 border-b border-border/80 bg-surface-raised/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 sm:px-6">
        <Link
          to="/"
          className="mr-auto flex min-h-11 items-center gap-2.5 rounded-xl pr-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal text-white">
            <Plane className="h-4 w-4" strokeWidth={2.4} aria-hidden />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            Gagan
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/planner" className={linkClass}>
            Planner
          </NavLink>
          <a href="/#how-it-works" className={linkClass({ isActive: false })}>
            How it Works
          </a>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl border-2 border-border bg-surface px-2.5 pr-3 font-bold text-ink transition hover:border-teal/40"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-xs font-extrabold text-white">
                  {initials || <UserRound className="h-4 w-4" />}
                </span>
                <span className="max-w-[8rem] truncate text-sm">{user.name}</span>
              </button>
              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-surface-raised py-1 shadow-lg"
                >
                  <Link
                    to="/dashboard"
                    role="menuitem"
                    className="flex min-h-11 items-center px-4 text-sm font-semibold text-ink hover:bg-surface"
                  >
                    My Deliveries
                  </Link>
                  <Link
                    to="/profile"
                    role="menuitem"
                    className="flex min-h-11 items-center px-4 text-sm font-semibold text-ink hover:bg-surface"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={logout}
                    className="flex min-h-11 w-full items-center px-4 text-sm font-semibold text-coral hover:bg-coral-soft"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex min-h-11 items-center rounded-2xl px-4 text-sm font-bold text-ink-muted transition hover:text-ink"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex min-h-11 items-center rounded-2xl bg-teal px-4 text-sm font-bold text-white transition hover:bg-teal-dark"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-surface text-ink md:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
          <span className="sr-only">Menu</span>
        </button>
      </div>

      {menuOpen && (
        <div
          id={menuId}
          className="border-t border-border bg-surface-raised px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink
              to="/planner"
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              Planner
            </NavLink>
            <a
              href="/#how-it-works"
              className={linkClass({ isActive: false })}
              onClick={() => setMenuOpen(false)}
            >
              How it Works
            </a>
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  My Deliveries
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                  className="inline-flex min-h-11 items-center rounded-xl px-3 text-left text-sm font-bold text-coral"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border-2 border-border text-sm font-bold text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-teal text-sm font-bold text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
