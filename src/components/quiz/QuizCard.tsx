import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import FavoriteIcon from '@mui/icons-material/Favorite'
import QuizIcon from '@mui/icons-material/Quiz'
import { useNavigate } from 'react-router-dom'
import type { QuizSummaryResponse } from '../../types/api'
import { CATEGORY_LABELS, QUIZ_TYPE_LABELS } from '../../types/api'

interface Props {
  quiz: QuizSummaryResponse
}

const TYPE_COLOR: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  TestWiedzy: 'primary',
  QuizOsobowosci: 'secondary',
  QuizDopasowania: 'success',
  UzupelnianieLukQuiz: 'warning',
  Ranking: 'info',
}

export default function QuizCard({ quiz }: Props) {
  const navigate = useNavigate()

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        onClick={() => navigate(`/quizzes/${quiz.id}`)}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 0 }}
      >
        <CardContent sx={{ width: '100%', flex: 1 }}>
          <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
            <Chip
              label={QUIZ_TYPE_LABELS[quiz.quizType]}
              color={TYPE_COLOR[quiz.quizType] ?? 'default'}
              size="small"
            />
            <Chip label={CATEGORY_LABELS[quiz.category]} size="small" variant="outlined" />
          </Stack>

          <Typography variant="h6" gutterBottom sx={{ lineHeight: 1.3 }}>
            {quiz.title}
          </Typography>

          {quiz.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 1,
              }}
            >
              {quiz.description}
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary">
            {quiz.author?.username ?? '[usunięty]'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <QuizIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {quiz.questionsCount} pyt.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FavoriteIcon sx={{ fontSize: 16, color: 'error.light' }} />
              <Typography variant="caption" color="text.secondary">
                {quiz.likesCount}
              </Typography>
            </Box>
            {quiz.limitCzasuSekundy && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {Math.floor(quiz.limitCzasuSekundy / 60)} min
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
