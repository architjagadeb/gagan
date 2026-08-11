import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createUser,
  findUserByEmail,
  getSessionUser,
  setSessionEmail,
  toPublicUser,
  updateUser,
} from './storage'
import type { LoginInput, PublicUser, SignupInput } from './types'
import type { DroneProfileId } from '../types'

type AuthContextValue = {
  user: PublicUser | null
  isAuthenticated: boolean
  signup: (input: SignupInput) => void
  login: (input: LoginInput) => void
  logout: () => void
  updatePreferredDrone: (droneId: DroneProfileId) => void
  updateName: (name: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(() => getSessionUser())

  const signup = useCallback((input: SignupInput) => {
    const name = input.name.trim()
    const email = input.email.trim().toLowerCase()
    const password = input.password

    if (name.length < 2) throw new Error('Name must be at least 2 characters')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Enter a valid email address')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    const created = createUser({
      id: crypto.randomUUID(),
      name,
      email,
      password,
      preferredDroneId: 'standard',
      createdAt: new Date().toISOString(),
    })
    setSessionEmail(created.email)
    setUser(created)
  }, [])

  const login = useCallback((input: LoginInput) => {
    const email = input.email.trim().toLowerCase()
    const found = findUserByEmail(email)
    if (!found || found.password !== input.password) {
      throw new Error('Email or password is incorrect')
    }
    setSessionEmail(found.email)
    setUser(toPublicUser(found))
  }, [])

  const logout = useCallback(() => {
    setSessionEmail(null)
    setUser(null)
  }, [])

  const updatePreferredDrone = useCallback(
    (droneId: DroneProfileId) => {
      if (!user) return
      const updated = updateUser(user.email, { preferredDroneId: droneId })
      if (updated) setUser(updated)
    },
    [user],
  )

  const updateName = useCallback(
    (name: string) => {
      if (!user) return
      const trimmed = name.trim()
      if (trimmed.length < 2) throw new Error('Name must be at least 2 characters')
      const updated = updateUser(user.email, { name: trimmed })
      if (updated) setUser(updated)
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      updatePreferredDrone,
      updateName,
    }),
    [user, signup, login, logout, updatePreferredDrone, updateName],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
