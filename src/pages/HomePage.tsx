import {
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Typography,
  Alert,
} from '@mui/material'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuizzes } from '../api/quiz.api'
import Layout from '../components/layout/Layout'
import QuizCard from '../components/quiz/QuizCard'
import QuizFilters from '../components/quiz/QuizFilters'
import type { Category } from '../types/api'

export default function HomePage() {
  const [category, setCategory] = useState<Category | ''>('')
  const [page, setPage] = useState(0)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['quizzes', { category, page }],
    queryFn: () =>
      getQuizzes({ category: category || undefined, page, size: 12 }),
  })

  const handleCategoryChange = (v: Category | '') => {
    setCategory(v)
    setPage(0)
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Odkryj quizy
      </Typography>

      <QuizFilters
        category={category}
        onCategoryChange={handleCategoryChange}
        onReset={() => { setCategory(''); setPage(0) }}
      />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          Nie udało się załadować quizów. Sprawdź czy backend jest uruchomiony.
        </Alert>
      )}

      {data && data.content.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={6}>
          Brak quizów spełniających kryteria.
        </Typography>
      )}

      <Grid container spacing={2}>
        {data?.content.map((quiz) => (
          <Grid item xs={12} sm={6} md={4} key={quiz.id}>
            <QuizCard quiz={quiz} />
          </Grid>
        ))}
      </Grid>

      {(data?.totalPages ?? 0) > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={data?.totalPages}
            page={page + 1}
            onChange={(_, p) => setPage(p - 1)}
            color="primary"
          />
        </Box>
      )}
    </Layout>
  )
}
