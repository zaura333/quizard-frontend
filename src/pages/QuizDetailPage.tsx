import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PublishIcon from '@mui/icons-material/Publish'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteQuiz, getQuiz, publishQuiz } from '../api/quiz.api'
import Layout from '../components/layout/Layout'
import LikeButton from '../components/quiz/LikeButton'
import CommentList from '../components/comments/CommentList'
import CommentForm from '../components/comments/CommentForm'
import { useAuth } from '../hooks/useAuth'
import {
  CATEGORY_LABELS,
  QUIZ_TYPE_LABELS,
} from '../types/api'

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>()
  const quizId = Number(id)
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: quiz, isLoading, isError } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuiz(quizId),
  })

  const publishMutation = useMutation({
    mutationFn: () => publishQuiz(quizId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quiz', quizId] }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteQuiz(quizId),
    onSuccess: () => navigate('/'),
  })

  if (isLoading) return (
    <Layout><Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box></Layout>
  )

  if (isError || !quiz) return (
    <Layout><Alert severity="error">Nie znaleziono quizu.</Alert></Layout>
  )

  const isOwner = user && quiz.author && quiz.author.id === user.id
  const canEdit = isOwner || isAdmin

  return (
    <Layout maxWidth="md">
      {/* Nagłówek */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
          <Chip label={QUIZ_TYPE_LABELS[quiz.quizType]} color="primary" size="small" />
          <Chip label={CATEGORY_LABELS[quiz.category]} size="small" variant="outlined" />
          {quiz.status === 'DRAFT' && (
            <Chip label="Szkic" color="warning" size="small" />
          )}
        </Stack>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          {quiz.title}
        </Typography>

        {quiz.description && (
          <Typography color="text.secondary" mb={2}>
            {quiz.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Autor: <strong>{quiz.author?.username ?? '[usunięty]'}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pytań: <strong>{quiz.questionsCount}</strong>
          </Typography>
          {quiz.limitCzasuSekundy && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {Math.floor(quiz.limitCzasuSekundy / 60)} min {quiz.limitCzasuSekundy % 60}s
              </Typography>
            </Box>
          )}
          <LikeButton quiz={quiz} />
        </Box>

        {/* Akcje */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {quiz.status === 'PUBLISHED' && (
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => navigate(`/quizzes/${quizId}/solve`)}
              size="large"
            >
              Rozwiąż quiz
            </Button>
          )}
          {canEdit && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/quizzes/${quizId}/edit`)}
            >
              Edytuj
            </Button>
          )}
          {canEdit && quiz.status === 'DRAFT' && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<PublishIcon />}
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
            >
              Opublikuj
            </Button>
          )}
          {canEdit && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteOpen(true)}
            >
              Usuń
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Komentarze */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Komentarze
        </Typography>
        <CommentList quizId={quizId} authorId={quiz.author?.id} />
        {user && (
          <>
            <Divider sx={{ my: 2 }} />
            <CommentForm quizId={quizId} />
          </>
        )}
        {!user && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            <Button size="small" onClick={() => navigate('/login')}>Zaloguj się</Button>, aby dodać komentarz.
          </Typography>
        )}
      </Paper>

      {/* Dialog usunięcia */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Usuń quiz</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć quiz <strong>„{quiz.title}"</strong>? Tej operacji nie można cofnąć.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Anuluj</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}
