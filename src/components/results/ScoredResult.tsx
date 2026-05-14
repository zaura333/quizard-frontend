import { Box, Chip, Divider, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import type { AttemptResult } from '../../types/api'

interface Props {
  result: AttemptResult
  questions: { id: number; tresc: string }[]
}

export default function ScoredResult({ result, questions }: Props) {
  const pct = Math.round(result.percentScore ?? 0)
  const questionMap = Object.fromEntries(questions.map((q) => [q.id, q.tresc]))

  return (
    <Box>
      {/* Wynik ogólny */}
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h2" fontWeight={700}>
          {pct}%
        </Typography>
        <Typography variant="h6">
          {result.totalPoints} / {result.maxPoints} punktów
        </Typography>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
        />
      </Paper>

      {/* Szczegóły pytań */}
      {result.questionResults && result.questionResults.length > 0 && (
        <Stack spacing={1.5}>
          {result.questionResults.map((qr, i) => (
            <Paper key={qr.questionId} variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                {qr.correct ? (
                  <CheckCircleIcon color="success" sx={{ mt: 0.3, flexShrink: 0 }} />
                ) : (
                  <CancelIcon color="error" sx={{ mt: 0.3, flexShrink: 0 }} />
                )}
                <Box flex={1}>
                  <Typography fontWeight={500} gutterBottom>
                    {i + 1}. {questionMap[qr.questionId] ?? `Pytanie #${qr.questionId}`}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Twoja odpowiedź: ${qr.givenAnswer || '—'}`}
                      size="small"
                      color={qr.correct ? 'success' : 'error'}
                      variant="outlined"
                    />
                    {!qr.correct && (
                      <Chip
                        label={`Poprawna: ${qr.correctAnswer}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={`${qr.pointsEarned}/${qr.maxPoints} pkt`}
                      size="small"
                      variant="filled"
                      color={qr.correct ? 'success' : 'default'}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {pct >= 90
          ? '🏆 Doskonały wynik!'
          : pct >= 70
          ? '👍 Dobry wynik!'
          : pct >= 50
          ? '📚 Całkiem nieźle, ale warto powtórzyć materiał.'
          : '💪 Nie poddawaj się — spróbuj jeszcze raz!'}
      </Typography>
    </Box>
  )
}
