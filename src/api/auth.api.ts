import api from './axios'
import type { LoginRequest, RegisterRequest, UserResponse } from '../types/api'

export const register = (data: RegisterRequest) =>
  api.post<UserResponse>('/auth/register', data).then((r) => r.data)

export const login = (data: LoginRequest) =>
  api.post<UserResponse>('/auth/login', data).then((r) => r.data)

export const logout = () =>
  api.post<void>('/auth/logout').then((r) => r.data)

export const getMe = () =>
  api.get<UserResponse>('/users/me').then((r) => r.data)

export const deleteAccount = () =>
  api.delete<void>('/users/me').then((r) => r.data)
