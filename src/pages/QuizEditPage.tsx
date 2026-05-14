import { Alert, Box, Button, CircularProgress, Paper, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getQuiz, publishQuiz, updateQuiz } from '../api/quiz.api'
import Layout from '../components/layout/Layout'
import QuizMetaForm from '../components/creator/QuizMetaForm'
import QuestionList from '../components/creator/QuestionList'
import type { CreateQuizRequest, QuizTypeInput } from '../types/api'
import { QUIZ_TYPE_NAME_TO_INPUT } from '../types/api'

export default function QuizEditPage() {
  const { id } = useParams<{ id: string }>()
  const quizId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState(0)
  const [metaError, setMetaError] = useState('')

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuiz(quizId),
  })

  const updateMutation = useMutation({
    mutationFn: (data: CreateQuizRequest) => updateQuiz(quizId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
      setTab(1)
    },
    onError: () => setMetaError('Nie udało się zapisać zmian.'),
  })

  const publishMutation = useMutation({
    mutationFn: () => publishQuiz(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
      navigate(`/quizzes/${quizId}`)
    },
  })

  if (isLoading) return (
    <Layout><Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box></Layout>
  )

  if (!quiz) return (
    <Layout><Alert severity="error">Nie znaleziono quizu.</Alert></Layout>
  )

  const quizTypeInput = QUIZ_TYPE_NAME_TO_INPUT[quiz.quizType]

  return (
    <Layout maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Edytuj: {quiz.title}
        </Typography>
        {quiz.status === 'DRAFT' && (
          <Button
            variant="contained"
            color="success"
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
          >
            Opublikuj
          </Button>
        )}
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Informacje" />
        <Tab label="Pytania" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 3 }}>
          <QuizMetaForm
            defaultValues={{
              title: quiz.title,
              description: quiz.description ?? '',
              category: quiz.category,
              quizType: quizTypeInput,
              limitCzasuSekundy: quiz.limitCzasuSekundy,
              mozliweWyniki: quiz.mozliweWyniki ?? [],
              poziomy: quiz.poziomy ?? [],
            }}
            onSubmit={(data) => {
              setMetaError('')
              updateMutation.mutate(data)
            }}
            isLoading={updateMutation.isPending}
            error={metaError}
            lockType
          />
        </Paper>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3 }}>
          <QuestionList
            quizId={quizId}
            quizType={quizTypeInput as QuizTypeInput}
            mozliweWyniki={quiz.mozliweWyniki ?? []}
          />
        </Paper>
      )}
    </Layout>
  )
}
