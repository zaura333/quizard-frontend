import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteQuestion, getQuestions, updateQuestion } from '../../api/question.api'
import type { Pytanie, QuizTypeInput } from '../../types/api'
import { PYTANIE_TYPE_LABELS } from '../../types/api'
import QuestionEditor from './QuestionEditor'

interface Props {
  quizId: number
  quizType: QuizTypeInput
  mozliweWyniki?: string[]
}

export default function QuestionList({ quizId, quizType, mozliweWyniki = [] }: Props) {
  const [editorOpen, setEditorOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions', quizId],
    queryFn: () => getQuestions(quizId),
  })

  const deleteMutation = useMutation({
    mutationFn: (qid: number) => deleteQuestion(quizId, qid),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions', quizId] }),
  })

  const moveMutation = useMutation({
    mutationFn: ({ q, delta }: { q: Pytanie; delta: number }) => {
      const sorted = [...questions].sort((a, b) => a.kolejnosc - b.kolejnosc)
      const idx = sorted.findIndex((x) => x.id === q.id)
      const swapIdx = idx + delta
      if (swapIdx < 0 || swapIdx >= sorted.length) return Promise.resolve()
      const swapQ = sorted[swapIdx]
      return Promise.all([
        updateQuestion(quizId, q.id, { ...q, kolejnosc: swapQ.kolejnosc } as any),
        updateQuestion(quizId, swapQ.id, { ...swapQ, kolejnosc: q.kolejnosc } as any),
      ])
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions', quizId] }),
  })

  const sorted = [...questions].sort((a, b) => a.kolejnosc - b.kolejnosc)

  if (isLoading) return <CircularProgress size={24} />

  return (
    <Box>
      <Stack spacing={1} mb={2}>
        {sorted.length === 0 && (
          <Typography color="text.secondary" variant="body2">
            Brak pytań. Dodaj pierwsze pytanie poniżej.
          </Typography>
        )}
        {sorted.map((q, i) => (
          <Paper key={q.id} variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography fontWeight={600} sx={{ minWidth: 28, color: 'text.secondary' }}>
              {i + 1}.
            </Typography>
            <Box flex={1} sx={{ overflow: 'hidden' }}>
              <Typography noWrap variant="body2" fontWeight={500}>
                {q.tresc}
              </Typography>
              <Chip label={PYTANIE_TYPE_LABELS[q.pytanieType]} size="small" sx={{ mt: 0.5 }} />
            </Box>
            <Tooltip title="W górę">
              <span>
                <IconButton
                  size="small"
                  disabled={i === 0 || moveMutation.isPending}
                  onClick={() => moveMutation.mutate({ q, delta: -1 })}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="W dół">
              <span>
                <IconButton
                  size="small"
                  disabled={i === sorted.length - 1 || moveMutation.isPending}
                  onClick={() => moveMutation.mutate({ q, delta: 1 })}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Usuń pytanie">
              <IconButton
                size="small"
                color="error"
                onClick={() => deleteMutation.mutate(q.id)}
                disabled={deleteMutation.isPending}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Paper>
        ))}
      </Stack>

      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={() => setEditorOpen(true)}
      >
        Dodaj pytanie
      </Button>

      <QuestionEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        quizId={quizId}
        quizType={quizType}
        nextKolejnosc={sorted.length + 1}
        mozliweWyniki={mozliweWyniki}
      />
    </Box>
  )
}
