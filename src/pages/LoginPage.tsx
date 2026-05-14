import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store/store'
import { loginUser } from '../store/authSlice'
import Layout from '../components/layout/Layout'
import type { LoginRequest } from '../types/api'
import { useState } from 'react'

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>()

  const onSubmit = async (data: LoginRequest) => {
    setError('')
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      navigate('/')
    } else {
      setError('Nieprawidłowy email lub hasło.')
    }
  }

  return (
    <Layout maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }}>
          <Typography variant="h5" gutterBottom fontWeight={700} textAlign="center">
            Zaloguj się
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email', { required: 'Email jest wymagany' })}
              label="Email"
              type="email"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('password', { required: 'Hasło jest wymagane' })}
              label="Hasło"
              type="password"
              fullWidth
              sx={{ mb: 3 }}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
            >
              Zaloguj
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" mt={2}>
            Nie masz konta?{' '}
            <Link to="/register" style={{ color: 'inherit', fontWeight: 600 }}>
              Zarejestruj się
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Layout>
  )
}
