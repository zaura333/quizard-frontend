import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store/store'
import { initAuth } from './store/authSlice'
import type { AppDispatch } from './store/store'
import theme from './theme/theme'
import AppRouter from './router/AppRouter'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

function AppInit() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Przy każdym odświeżeniu strony sprawdź czy JWT cookie jest wciąż ważne
    dispatch(initAuth())
  }, [dispatch])

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppInit />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}
