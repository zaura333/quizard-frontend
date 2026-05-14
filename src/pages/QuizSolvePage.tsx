import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useCallback, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getQuiz, submitAttempt } from '../api/quiz.api'
import { getQuestions } from '../api/question.api'
import Layout from '../components/layout/Layout'
import TimerBar from '../components/quiz/TimerBar'
import QuestionRenderer from '../components/questions/QuestionRenderer'
import { useQuizSolver } from '../hooks/useQuizSolver'
import type { PytanieElementRankingu } from '../types/api'

// ─── Ranking tierlist solve flow ─────────────────────────────────────────────

interface TierState {
  [poziom: string]: string[]
}

function RankingSolveFlow({
  elements,
  poziomy,
  onSubmit,
}: {
  elements: PytanieElementRankingu[]
  poziomy: string[]
  onSubmit: (tiers: TierState) => void
}) {
  const [tiers, setTiers] = useState<TierState>(
    Object.fromEntries(poziomy.map((p) => [p, []]))
  )
  const [pool, setPool] = useState<string[]>(elements.map((e) => e.tresc))
  const dragRef = useRef<{ item: string; from: 'pool' | string } | null>(null)

  const handleDragStart = (item: string, from: 'pool' | string) => {
    dragRef.current = { item, from }
  }

  const handleDropToTier = (poziom: string) => {
    if (!dragRef.current) return
    const { item, from } = dragRef.current
    if (from === poziom) return

    setTiers((prev) => {
      const next = { ...prev }
      // usuń z poprzedniego miejsca
      if (from !== 'pool') next[from] = next[from].filter((x) => x !== item)
      // dodaj do nowego
      if (!next[poziom].includes(item)) next[poziom] = [...next[poziom], item]
      return next
    })
    if (from === 'pool') {
      setPool((p) => p.filter((x) => x !== item))
    }
    dragRef.current = null
  }

  const handleDropToPool = () => {
    if (!dragRef.current) return
    const { item, from } = dragRef.current
    if (from === 'pool') return
    setTiers((prev) => ({ ...prev, [from]: prev[from].filter((x) => x !== item) }))
    setPool((p) => (p.includes(item) ? p : [...p, item]))
    dragRef.current = null
  }

  const TIER_COLORS: Record<string, string> = {
    S: '#ff7675', A: '#fdcb6e', B: '#55efc4', C: '#74b9ff', D: '#a29bfe',
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Ułóż elementy w tierliście</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Przeciągnij elementy z puli do odpowiednich poziomów.
      </Typography>

      {/* Tierlist */}
      {poziomy.map((p) => (
        <Box
          key={p}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDropToTier(p)}
          sx={{
            display: 'flex', minHeight: 56, mb: 1, borderRadius: 1, overflow: 'hidden',
            border: '2px dashed transparent',
            '&:hover': { borderColor: 'primary.light' },
          }}
        >
          <Box sx={{
            width: 52, bgcolor: TIER_COLORS[p] ?? '#b2bec3',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Typography fontWeight={900} fontSize="1.4rem">{p}</Typography>
          </Box>
          <Box sx={{
            flex: 1, bgcolor: 'grey.100', display: 'flex',
            flexWrap: 'wrap', alignItems: 'center', gap: 1, p: 1,
          }}>
            {tiers[p].map((item) => (
              <Chip
                key={item}
                label={item}
                draggable
                onDragStart={() => handleDragStart(item, p)}
                sx={{ cursor: 'grab', bgcolor: TIER_COLORS[p] ?? undefined }}
              />
            ))}
          </Box>
        </Box>
      ))}

      {/* Pula elementów */}
      <Paper
        variant="outlined"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToPool}
        sx={{ p: 2, mt: 2, minHeight: 60, display: 'flex', flexWrap: 'wrap', gap: 1 }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ width: '100%' }}>
          Pula elementów — przeciągnij do poziomu
        </Typography>
        {pool.map((item) => (
          <Chip
            key={item}
            label={item}
            draggable
            onDragStart={() => handleDragStart(item, 'pool')}
            sx={{ cursor: 'grab' }}
          />
        ))}
        {pool.length === 0 && (
          <Typography variant="body2" color="text.secondary">Wszystkie elementy przypisane ✓</Typography>
        )}
      </Paper>

      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 3 }}
        startIcon={<SendIcon />}
        onClick={() => onSubmit(tiers)}
      >
        Zatwierdź ranking
      </Button>
    </Box>
  )
}

// ─── Główna strona rozwiązywania ──────────────────────────────────────────────

export default function QuizSolvePage() {
  const { id } = useParams<{ id: string }>()
  const quizId = Number(id)
  const navigate = useNavigate()
  const { answers, setAnswer, buildAnswerDtos, answeredCount, startedAt } = useQuizSolver()

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuiz(quizId),
  })

  const { data: questions = [], isLoading: qLoading } = useQuery({
    queryKey: ['questions', quizId],
    queryFn: () => getQuestions(quizId),
    enabled: !!quiz,
  })

  const mutation = useMutation({
    mutationFn: () =>
      submitAttempt(quizId, {
        answers: buildAnswerDtos(questions),
        startedAtEpochMs: startedAt,
      }),
    onSuccess: (result) => {
      navigate(`/quizzes/${quizId}/result`, { state: { result } })
    },
  })

  const handleTimerExpire = useCallback(() => {
    mutation.mutate()
  }, [])  // eslint-disable-line

  const handleRankingSubmit = (tiers: TierState) => {
    navigate(`/quizzes/${quizId}/result`, {
      state: {
        result: { quizId, quizType: 'Ranking' },
        tiers,
        poziomy: quiz?.poziomy ?? [],
        quizTitle: quiz?.title ?? '',
      },
    })
  }

  if (quizLoading || qLoading) return (
    <Layout><Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box></Layout>
  )

  if (!quiz) return (
    <Layout><Alert severity="error">Nie znaleziono quizu.</Alert></Layout>
  )

  const scorableQuestions = questions.filter((q) => q.pytanieType !== 'ELEMENT_RANKINGU')
  const rankingElements = questions.filter(
    (q): q is PytanieElementRankingu => q.pytanieType === 'ELEMENT_RANKINGU'
  )
  const isRanking = quiz.quizType === 'Ranking'
  const hasTimer = quiz.limitCzasuSekundy != null && quiz.limitCzasuSekundy > 0

  return (
    <Layout maxWidth="md">
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>{quiz.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {isRanking
            ? `Ułóż ${rankingElements.length} elementów w tierliście`
            : `${scorableQuestions.length} pytań · ${answeredCount(questions)} udzielonych odpowiedzi`}
        </Typography>
      </Box>

      {hasTimer && !isRanking && (
        <TimerBar seconds={quiz.limitCzasuSekundy!} onExpire={handleTimerExpire} />
      )}

      {isRanking ? (
        <RankingSolveFlow
          elements={rankingElements}
          poziomy={quiz.poziomy ?? ['S', 'A', 'B', 'C', 'D']}
          onSubmit={handleRankingSubmit}
        />
      ) : (
        <>
          {questions
            .filter((q) => q.pytanieType !== 'ELEMENT_RANKINGU')
            .sort((a, b) => a.kolejnosc - b.kolejnosc)
            .map((pytanie, i) => (
              <QuestionRenderer
                key={pytanie.id}
                pytanie={pytanie}
                index={i}
                value={answers[pytanie.id] ?? ''}
                onChange={(v) => setAnswer(pytanie.id, v)}
              />
            ))}

          {/* Progress */}
          <Box sx={{ my: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Postęp
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {answeredCount(questions)} / {scorableQuestions.length}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={scorableQuestions.length > 0
                ? (answeredCount(questions) / scorableQuestions.length) * 100
                : 0}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Nie udało się wysłać odpowiedzi. Spróbuj ponownie.
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<SendIcon />}
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Wysyłanie…' : 'Wyślij odpowiedzi'}
          </Button>
        </>
      )}
    </Layout>
  )
}
