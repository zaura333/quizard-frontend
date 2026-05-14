import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import QuizDetailPage from '../pages/QuizDetailPage'
import QuizSolvePage from '../pages/QuizSolvePage'
import QuizResultPage from '../pages/QuizResultPage'
import QuizCreatePage from '../pages/QuizCreatePage'
import QuizEditPage from '../pages/QuizEditPage'
import MyQuizzesPage from '../pages/MyQuizzesPage'
import NotFoundPage from '../pages/NotFoundPage'
import { Box, CircularProgress } from '@mui/material'

/** Trasa wymagająca zalogowania — przekieruj na /login jeśli niezalogowany */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, initialized } = useAuth()
  if (!initialized) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}

/** Trasa tylko dla niezalogowanych — przekieruj na / jeśli zalogowany */
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, initialized } = useAuth()
  if (!initialized) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
  if (isLoggedIn) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      <Route path="/quizzes/create" element={<ProtectedRoute><QuizCreatePage /></ProtectedRoute>} />
      <Route path="/quizzes/:id" element={<QuizDetailPage />} />
      <Route path="/quizzes/:id/solve" element={<QuizSolvePage />} />
      <Route path="/quizzes/:id/result" element={<QuizResultPage />} />
      <Route path="/quizzes/:id/edit" element={<ProtectedRoute><QuizEditPage /></ProtectedRoute>} />

      <Route path="/my-quizzes" element={<ProtectedRoute><MyQuizzesPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
