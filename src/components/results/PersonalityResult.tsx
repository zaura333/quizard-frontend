import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import type { AttemptResult } from '../../types/api'

interface Props {
  result: AttemptResult
}

export default function PersonalityResult({ result }: Props) {
  const votes = result.personalityVotes ?? {}
  const maxVotes = Math.max(...Object.values(votes), 1)

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 3, textAlign: 'center', bgcolor: 'secondary.main', color: 'white' }}>
        <Typography variant="overline" sx={{ opacity: 0.8 }}>
          Twój wynik osobowości
        </Typography>
        <Typography variant="h3" fontWeight={700} mt={1}>
          {result.personalityResult ?? '—'}
        </Typography>
      </Paper>

      {Object.keys(votes).length > 0 && (
        <Box>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Rozkład głosów
          </Typography>
          <Stack spacing={1.5}>
            {Object.entries(votes)
              .sort(([, a], [, b]) => b - a)
              .map(([wynik, count]) => (
                <Box key={wynik}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={wynik === result.personalityResult ? 700 : 400}>
                      {wynik}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {count} głos{count === 1 ? '' : count < 5 ? 'y' : 'ów'}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(count / maxVotes) * 100}
                    color={wynik === result.personalityResult ? 'secondary' : 'inherit'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}
