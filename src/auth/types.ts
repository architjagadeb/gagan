import type { DroneProfileId } from '../types'

export type AuthUser = {
  id: string
  name: string
  email: string
  password: string
  preferredDroneId: DroneProfileId
  createdAt: string
}

export type PublicUser = Omit<AuthUser, 'password'>

export type SignupInput = {
  name: string
  email: string
  password: string
}

export type LoginInput = {
  email: string
  password: string
}
