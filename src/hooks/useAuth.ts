import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((s: RootState) => s.auth.user)
  const status = useSelector((s: RootState) => s.auth.status)
  const initialized = useSelector((s: RootState) => s.auth.initialized)

  return {
    user,
    status,
    initialized,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'ADMIN',
    dispatch,
  }
}
