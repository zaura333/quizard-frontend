import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Layout>
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h1" fontWeight={900} color="primary.main">
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Nie znaleziono strony
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Strona, której szukasz, nie istnieje lub została przeniesiona.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Wróć na stronę główną
        </Button>
      </Box>
    </Layout>
  )
}
