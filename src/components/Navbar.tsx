import { UserRound } from 'lucide-react'
import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { CheckDeliveryCta } from './CheckDeliveryCta'
import { Logo } from './Logo'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/planner', label: 'Planner' },
  { to: '/#how-it-works', label: 'How it Works', hash: true },
  { to: '/dashboard', label: 'Dashboard' },
] as const

function HowItWorksLink({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  const location = useLocation()

  const go = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.()
    if (location.pathname !== '/') {
      return
    }
    e.preventDefault()
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
    window.history.replaceState(null, '', '/#how-it-works')
  }

  return (
    <a href="/#how-it-works" className={className} onClick={go}>
      How it Works
    </a>
  )
}

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
  }, [location.pathname, location.hash])

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const initials = user
    ? user.name
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('')
    : ''

  return (
    <>
      <nav className="site-nav">
        <div className="site-nav-inner">
          <Logo />

          <div className="site-nav-links">
            {navItems.map((item) =>
              'hash' in item && item.hash ? (
                <HowItWorksLink key={item.label} />
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={'end' in item && item.end}
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </div>

          <div className="site-nav-right">
            {isAuthenticated && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-black/8 bg-white px-1.5 pr-2.5 text-[13px] font-medium text-[var(--text-main)]"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-bold text-white">
                    {initials || <UserRound className="h-3.5 w-3.5" />}
                  </span>
                  <span className="max-w-[7rem] truncate">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-black/8 bg-white py-1 shadow-lg"
                  >
                    <Link
                      to="/dashboard"
                      role="menuitem"
                      className="flex min-h-10 items-center px-4 text-sm text-[var(--text-main)] hover:bg-[#f5f5f5]"
                    >
                      My Deliveries
                    </Link>
                    <Link
                      to="/profile"
                      role="menuitem"
                      className="flex min-h-10 items-center px-4 text-sm text-[var(--text-main)] hover:bg-[#f5f5f5]"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={logout}
                      className="flex min-h-10 w-full items-center px-4 text-sm text-coral hover:bg-coral-soft"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            <CheckDeliveryCta />
          </div>

          <button
            type="button"
            className={`hamburger ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </nav>

      <div
        id={menuId}
        className={`nav-overlay ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        {navItems.map((item) =>
          'hash' in item && item.hash ? (
            <HowItWorksLink
              key={item.label}
              className="overlay-link"
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              end={'end' in item && item.end}
              className="overlay-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ),
        )}

        {isAuthenticated && user ? (
          <>
            <Link
              to="/profile"
              className="overlay-link"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              type="button"
              className="overlay-link w-full text-left"
              onClick={() => {
                logout()
                setMenuOpen(false)
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="overlay-link"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        )}

        <CheckDeliveryCta
          arrowSize={32}
          className="overlay-cta"
          onClick={() => setMenuOpen(false)}
        />
      </div>
    </>
  )
}
