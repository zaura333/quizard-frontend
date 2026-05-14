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
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PublishIcon from '@mui/icons-material/Publish'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteQuiz, getQuizzes, publishQuiz } from '../api/quiz.api'
import Layout from '../components/layout/Layout'
import { useAuth } from '../hooks/useAuth'
import { CATEGORY_LABELS, QUIZ_TYPE_LABELS } from '../types/api'
import type { QuizSummaryResponse } from '../types/api'

export default function MyQuizzesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState(0)
  const [toDelete, setToDelete] = useState<QuizSummaryResponse | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-quizzes', user?.id],
    queryFn: () => getQuizzes({ authorId: user!.id, size: 100 }),
    enabled: !!user,
  })

  const publishMutation = useMutation({
    mutationFn: (id: number) => publishQuiz(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-quizzes'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-quizzes'] })
      setToDelete(null)
    },
  })

  const all = data?.content ?? []
  const drafts = all.filter((q) => q.status === 'DRAFT')
  const published = all.filter((q) => q.status === 'PUBLISHED')
  const shown = tab === 0 ? published : drafts

  const QuizTable = ({ quizzes }: { quizzes: QuizSummaryResponse[] }) => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Tytuł</TableCell>
          <TableCell>Typ</TableCell>
          <TableCell>Kategoria</TableCell>
          <TableCell>Pytań</TableCell>
          <TableCell>Data</TableCell>
          <TableCell align="right">Akcje</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {quizzes.map((q) => (
          <TableRow key={q.id} hover>
            <TableCell>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                onClick={() => navigate(`/quizzes/${q.id}`)}
              >
                {q.title}
              </Typography>
            </TableCell>
            <TableCell>
              <Chip label={QUIZ_TYPE_LABELS[q.quizType]} size="small" />
            </TableCell>
            <TableCell>{CATEGORY_LABELS[q.category]}</TableCell>
            <TableCell>{q.questionsCount}</TableCell>
            <TableCell>
              {new Date(q.updatedAt).toLocaleDateString('pl-PL')}
            </TableCell>
            <TableCell align="right">
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Edytuj">
                  <IconButton size="small" onClick={() => navigate(`/quizzes/${q.id}/edit`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {q.status === 'DRAFT' && (
                  <Tooltip title="Opublikuj">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => publishMutation.mutate(q.id)}
                      disabled={publishMutation.isPending}
                    >
                      <PublishIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Usuń">
                  <IconButton size="small" color="error" onClick={() => setToDelete(q)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
        {quizzes.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center">
              <Typography color="text.secondary" variant="body2" py={2}>
                Brak quizów w tej kategorii.
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Moje quizy
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/quizzes/create')}
        >
          Utwórz quiz
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && (
        <>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label={`Opublikowane (${published.length})`} />
            <Tab label={`Szkice (${drafts.length})`} />
          </Tabs>

          <Paper>
            <QuizTable quizzes={shown} />
          </Paper>
        </>
      )}

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Usuń quiz</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć <strong>„{toDelete?.title}"</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Anuluj</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => toDelete && deleteMutation.mutate(toDelete.id)}
            disabled={deleteMutation.isPending}
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}
