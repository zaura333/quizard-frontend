import axios from 'axios'
import { store } from '../store/store'
import { clearUser } from '../store/authSlice'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,   // httpOnly JWT cookie
  headers: { 'Content-Type': 'application/json' },
})

// 401 → wyczyść store i przekieruj na login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearUser())
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
