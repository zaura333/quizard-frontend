import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Pagination,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { deleteComment, getComments } from '../../api/quiz.api'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  quizId: number
  authorId?: number | null
}

export default function CommentList({ quizId, authorId }: Props) {
  const { user, isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['comments', quizId, page],
    queryFn: () => getComments(quizId, page),
  })

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(quizId, commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', quizId] }),
  })

  if (isLoading) return <CircularProgress size={24} />

  const comments = data?.content ?? []

  return (
    <Box>
      {comments.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Brak komentarzy. Bądź pierwszy!
        </Typography>
      ) : (
        <Stack divider={<Divider />} spacing={0}>
          {comments.map((c) => {
            const canDelete =
              isAdmin ||
              (user && c.author && c.author.id === user.id)

            return (
              <Box key={c.id} sx={{ py: 1.5, display: 'flex', gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: 14 }}>
                  {(c.author?.username ?? '?')[0].toUpperCase()}
                </Avatar>
                <Box flex={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" fontWeight={600}>
                      {c.author?.username ?? '[usunięty]'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(c.createdAt).toLocaleDateString('pl-PL')}
                      </Typography>
                      {canDelete && (
                        <Tooltip title="Usuń komentarz">
                          <IconButton
                            size="small"
                            onClick={() => deleteMutation.mutate(c.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body2">{c.tresc}</Typography>
                </Box>
              </Box>
            )
          })}
        </Stack>
      )}

      {(data?.totalPages ?? 0) > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={data?.totalPages}
            page={page + 1}
            onChange={(_, p) => setPage(p - 1)}
            size="small"
          />
        </Box>
      )}
    </Box>
  )
}
