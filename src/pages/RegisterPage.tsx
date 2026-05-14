import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store/store'
import { registerUser } from '../store/authSlice'
import Layout from '../components/layout/Layout'
import type { RegisterRequest } from '../types/api'
import { useState } from 'react'

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterRequest>()

  const onSubmit = async (data: RegisterRequest) => {
    setError('')
    const result = await dispatch(registerUser(data))
    if (registerUser.fulfilled.match(result)) {
      navigate('/login')
    } else {
      setError('Rejestracja nie powiodła się. Sprawdź czy email lub nazwa użytkownika nie są już zajęte.')
    }
  }

  return (
    <Layout maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }}>
          <Typography variant="h5" gutterBottom fontWeight={700} textAlign="center">
            Zarejestruj się
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('username', {
                required: 'Nazwa użytkownika jest wymagana',
                minLength: { value: 3, message: 'Minimum 3 znaki' },
                maxLength: { value: 50, message: 'Maksimum 50 znaków' },
              })}
              label="Nazwa użytkownika"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              {...register('email', {
                required: 'Email jest wymagany',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Nieprawidłowy email' },
              })}
              label="Email"
              type="email"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('password', {
                required: 'Hasło jest wymagane',
                minLength: { value: 6, message: 'Minimum 6 znaków' },
              })}
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
              Zarejestruj
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" mt={2}>
            Masz już konto?{' '}
            <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
              Zaloguj się
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Layout>
  )
}
