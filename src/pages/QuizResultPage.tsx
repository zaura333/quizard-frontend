import { Alert, Box, Button, Paper, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ReplayIcon from '@mui/icons-material/Replay'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getQuestions } from '../api/question.api'
import Layout from '../components/layout/Layout'
import ScoredResult from '../components/results/ScoredResult'
import PersonalityResult from '../components/results/PersonalityResult'
import RankingResult from '../components/results/RankingResult'
import type { AttemptResult } from '../types/api'

export default function QuizResultPage() {
  const { id } = useParams<{ id: string }>()
  const quizId = Number(id)
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as {
    result?: AttemptResult
    tiers?: Record<string, string[]>
    poziomy?: string[]
    quizTitle?: string
  } | null

  const { data: questions = [] } = useQuery({
    queryKey: ['questions', quizId],
    queryFn: () => getQuestions(quizId),
    enabled: !!state?.result,
  })

  if (!state?.result && !state?.tiers) {
    return (
      <Layout maxWidth="md">
        <Alert severity="warning">
          Brak wyników do wyświetlenia.{' '}
          <Button size="small" onClick={() => navigate(`/quizzes/${quizId}`)}>
            Wróć do quizu
          </Button>
        </Alert>
      </Layout>
    )
  }

  const result = state.result
  const quizType = result?.quizType

  const renderResult = () => {
    if (quizType === 'Ranking' || state.tiers) {
      return (
        <RankingResult
          poziomy={state.poziomy ?? ['S', 'A', 'B', 'C', 'D']}
          assignments={Object.entries(state.tiers ?? {}).map(([poziom, elementy]) => ({
            poziom,
            elementy,
          }))}
          quizTitle={state.quizTitle ?? `Quiz #${quizId}`}
        />
      )
    }
    if (quizType === 'QuizOsobowosci' && result) {
      return <PersonalityResult result={result} />
    }
    if (result) {
      return (
        <ScoredResult
          result={result}
          questions={questions.map((q) => ({ id: q.id, tresc: q.tresc }))}
        />
      )
    }
    return null
  }

  return (
    <Layout maxWidth="md">
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Wyniki
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        {renderResult()}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={() => navigate(`/quizzes/${quizId}/solve`)}
        >
          Spróbuj ponownie
        </Button>
        <Button
          variant="text"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Strona główna
        </Button>
      </Box>
    </Layout>
  )
}
