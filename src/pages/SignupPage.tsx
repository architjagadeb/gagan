import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function SignupPage() {
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      signup({ name, email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">Sign up</h1>
      <p className="mt-1 text-sm font-medium text-ink-muted">
        Save delivery checks to your dashboard.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-4 rounded-3xl bg-surface-raised p-5 shadow-sm ring-1 ring-border"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-muted">Name</span>
          <input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-11 w-full rounded-2xl border-2 border-border bg-surface px-4 text-base font-semibold text-ink outline-none focus:border-teal"
          />
        </label>
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
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-11 w-full rounded-2xl border-2 border-border bg-surface px-4 text-base font-semibold text-ink outline-none focus:border-teal"
          />
          <span className="mt-1 block text-xs text-ink-muted">At least 6 characters</span>
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
          {pending ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm font-medium text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-teal hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}
