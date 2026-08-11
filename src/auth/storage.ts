import type { AuthUser, PublicUser } from './types'

const USERS_KEY = 'gagan.users'
const SESSION_KEY = 'gagan.session'

function readUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AuthUser[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function toPublicUser(user: AuthUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    preferredDroneId: user.preferredDroneId,
    createdAt: user.createdAt,
  }
}

export function getSessionEmail(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function setSessionEmail(email: string | null) {
  if (email) localStorage.setItem(SESSION_KEY, email)
  else localStorage.removeItem(SESSION_KEY)
}

export function findUserByEmail(email: string): AuthUser | undefined {
  const normalized = email.trim().toLowerCase()
  return readUsers().find((u) => u.email === normalized)
}

export function createUser(user: AuthUser): PublicUser {
  const users = readUsers()
  if (users.some((u) => u.email === user.email)) {
    throw new Error('An account with this email already exists')
  }
  users.push(user)
  writeUsers(users)
  return toPublicUser(user)
}

export function updateUser(
  email: string,
  patch: Partial<Pick<AuthUser, 'name' | 'preferredDroneId' | 'password'>>,
): PublicUser | null {
  const users = readUsers()
  const idx = users.findIndex((u) => u.email === email.trim().toLowerCase())
  if (idx < 0) return null
  users[idx] = { ...users[idx], ...patch }
  writeUsers(users)
  return toPublicUser(users[idx])
}

export function getSessionUser(): PublicUser | null {
  const email = getSessionEmail()
  if (!email) return null
  const user = findUserByEmail(email)
  return user ? toPublicUser(user) : null
}
