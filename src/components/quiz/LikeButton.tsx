import { IconButton, Typography, Box, Tooltip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { likeQuiz, unlikeQuiz } from '../../api/quiz.api'
import { useAuth } from '../../hooks/useAuth'
import type { QuizSummaryResponse } from '../../types/api'

interface Props {
  quiz: QuizSummaryResponse
  /** Czy aktualny user już polubił (do przekazania z zewnątrz jeśli znane, inaczej false) */
  initialLiked?: boolean
}

export default function LikeButton({ quiz, initialLiked = false }: Props) {
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()
  const [optimisticLiked, setOptimisticLiked] = useState(initialLiked)
  const [optimisticCount, setOptimisticCount] = useState(quiz.likesCount)

  const mutation = useMutation({
    mutationFn: () => (optimisticLiked ? unlikeQuiz(quiz.id) : likeQuiz(quiz.id)),
    onMutate: () => {
      const newLiked = !optimisticLiked
      setOptimisticLiked(newLiked)
      setOptimisticCount((c) => c + (newLiked ? 1 : -1))
    },
    onError: () => {
      // rollback
      setOptimisticLiked(optimisticLiked)
      setOptimisticCount(quiz.likesCount)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quiz.id] })
    },
  })

  return (
    <Tooltip title={isLoggedIn ? (optimisticLiked ? 'Cofnij polubienie' : 'Polub') : 'Zaloguj się, aby polubić'}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          onClick={() => isLoggedIn && mutation.mutate()}
          disabled={!isLoggedIn || mutation.isPending}
          color="error"
          size="small"
        >
          {optimisticLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2">{optimisticCount}</Typography>
      </Box>
    </Tooltip>
  )
}
