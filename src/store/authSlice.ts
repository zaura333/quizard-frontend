import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getMe, login, logout, register } from '../api/auth.api'
import type { LoginRequest, RegisterRequest, UserResponse } from '../types/api'

interface AuthState {
  user: UserResponse | null
  status: 'idle' | 'loading' | 'failed'
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  initialized: false,
}

/** Przy starcie aplikacji — próba odtworzenia sesji z httpOnly cookie */
export const initAuth = createAsyncThunk('auth/init', async () => {
  return await getMe()
})

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest) => {
    return await login(data)
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest) => {
    return await register(data)
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logout()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    // initAuth
    builder
      .addCase(initAuth.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'idle'
        state.initialized = true
      })
      .addCase(initAuth.rejected, (state) => {
        state.user = null
        state.status = 'idle'
        state.initialized = true
      })

    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'idle'
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed'
      })

    // registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'idle'
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = 'failed'
      })

    // logoutUser
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
    })
  },
})

export const { clearUser } = authSlice.actions
export default authSlice.reducer
