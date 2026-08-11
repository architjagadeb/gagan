import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { DRONE_PROFILES } from '../data/mock'
import type { DroneProfileId } from '../types'

export function ProfilePage() {
  const { user, logout, updatePreferredDrone, updateName } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? '')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!user) return null

  const onSaveName = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    try {
      updateName(name)
      setMessage('Name updated')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update name')
    }
  }

  const onDroneChange = (id: DroneProfileId) => {
    updatePreferredDrone(id)
    setMessage('Preferred drone saved')
    setError(null)
  }

  const onLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-display text-3xl font-extrabold text-ink">Profile</h1>
      <p className="mt-1 text-sm font-medium text-ink-muted">Your account settings</p>

      <section className="mt-6 rounded-3xl bg-surface-raised p-5 shadow-sm ring-1 ring-border">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Email</p>
        <p className="mt-1 text-base font-bold text-ink">{user.email}</p>

        <form onSubmit={onSaveName} className="mt-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-muted">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11 w-full rounded-2xl border-2 border-border bg-surface px-4 text-base font-semibold text-ink outline-none focus:border-teal"
            />
          </label>
          <button
            type="submit"
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-2xl bg-teal px-5 text-sm font-bold text-white hover:bg-teal-dark"
          >
            Save name
          </button>
        </form>
      </section>

      <section className="mt-4 rounded-3xl bg-surface-raised p-5 shadow-sm ring-1 ring-border">
        <h2 className="font-display text-lg font-bold text-ink">Preferred drone</h2>
        <p className="mt-1 text-sm font-medium text-ink-muted">
          Default when you open the planner
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DRONE_PROFILES.map((drone) => {
            const active = user.preferredDroneId === drone.id
            return (
              <button
                key={drone.id}
                type="button"
                onClick={() => onDroneChange(drone.id)}
                className={`min-h-11 rounded-2xl border-2 px-3 py-2.5 text-left transition ${
                  active
                    ? 'border-teal bg-teal-soft text-ink'
                    : 'border-border bg-surface text-ink-muted hover:border-teal/40'
                }`}
              >
                <span className="block text-sm font-bold">{drone.name}</span>
                <span className="block text-xs font-medium">
                  {drone.maxPayloadKg} kg · {drone.maxRangeKm} km
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {(message || error) && (
        <p
          className={`mt-4 rounded-2xl px-3 py-2.5 text-sm font-semibold ${
            error ? 'bg-coral-soft text-coral-dark' : 'bg-go-soft text-go'
          }`}
        >
          {error ?? message}
        </p>
      )}

      <button
        type="button"
        onClick={onLogout}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border-2 border-coral bg-coral-soft text-base font-bold text-coral-dark transition hover:bg-coral hover:text-white"
      >
        Logout
      </button>
    </div>
  )
}
