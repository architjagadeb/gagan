import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== '/login'
      ? (location.state as { from: string }).from
      : '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (isAuthenticated) return <Navigate to={from} replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">Login</h1>
      <p className="mt-1 text-sm font-medium text-ink-muted">
        Welcome back — pick up where you left off.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-4 rounded-3xl bg-surface-raised p-5 shadow-sm ring-1 ring-border"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-muted">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 w-full rounded-2xl border-2 border-border bg-surface px-4 text-base font-semibold text-ink outline-none focus:border-teal"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-muted">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-11 w-full rounded-2xl border-2 border-border bg-surface px-4 text-base font-semibold text-ink outline-none focus:border-teal"
          />
        </label>

        {error && (
          <p className="rounded-2xl bg-coral-soft px-3 py-2.5 text-sm font-semibold text-coral-dark">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-teal text-base font-bold text-white transition hover:bg-teal-dark disabled:opacity-60"
        >
          {pending ? 'Signing in…' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm font-medium text-ink-muted">
        New here?{' '}
        <Link to="/signup" className="font-bold text-teal hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
