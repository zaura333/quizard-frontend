import {
  Alert,
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createQuiz, publishQuiz } from '../api/quiz.api'
import Layout from '../components/layout/Layout'
import QuizMetaForm from '../components/creator/QuizMetaForm'
import QuestionList from '../components/creator/QuestionList'
import type { CreateQuizRequest, QuizSummaryResponse, QuizTypeInput } from '../types/api'

const STEPS = ['Informacje o quizie', 'Pytania', 'Publikacja']

export default function QuizCreatePage() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [quiz, setQuiz] = useState<QuizSummaryResponse | null>(null)
  const [metaError, setMetaError] = useState('')

  const createMutation = useMutation({
    mutationFn: (data: CreateQuizRequest) => createQuiz(data),
    onSuccess: (created) => {
      setQuiz(created)
      setActiveStep(1)
    },
    onError: () => setMetaError('Nie udało się utworzyć quizu. Spróbuj ponownie.'),
  })

  const publishMutation = useMutation({
    mutationFn: () => publishQuiz(quiz!.id),
    onSuccess: () => navigate(`/quizzes/${quiz!.id}`),
  })

  return (
    <Layout maxWidth="md">
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Utwórz nowy quiz
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Paper sx={{ p: 3 }}>
          <QuizMetaForm
            onSubmit={(data) => {
              setMetaError('')
              createMutation.mutate(data)
            }}
            isLoading={createMutation.isPending}
            error={metaError}
          />
        </Paper>
      )}

      {activeStep === 1 && quiz && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pytania do: <strong>{quiz.title}</strong>
            </Typography>
            <QuestionList
              quizId={quiz.id}
              quizType={quiz.quizType as unknown as QuizTypeInput}
              mozliweWyniki={quiz.mozliweWyniki ?? []}
            />
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => setActiveStep(2)}>
              Dalej — Publikacja
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 2 && quiz && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Quiz gotowy! 🎉
          </Typography>
          <Typography color="text.secondary" mb={3}>
            <strong>{quiz.title}</strong> jest zapisany jako szkic. Możesz go opublikować teraz lub później.
          </Typography>

          {publishMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Nie udało się opublikować quizu.
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/quizzes/${quiz.id}`)}
            >
              Zostaw jako szkic
            </Button>
            <Button
              variant="contained"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending ? 'Publikowanie…' : 'Opublikuj teraz'}
            </Button>
          </Box>
        </Paper>
      )}
    </Layout>
  )
}
