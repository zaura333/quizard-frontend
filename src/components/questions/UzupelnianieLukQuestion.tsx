import { Box, TextField, Typography } from '@mui/material'
import type { PytanieUzupelnianieLuk } from '../../types/api'

interface Props {
  pytanie: PytanieUzupelnianieLuk
  value: string     // CSV odpowiedzi per luka
  onChange: (v: string) => void
}

export default function UzupelnianieLukQuestion({ pytanie, value, onChange }: Props) {
  // Podziel treść na segmenty — luki zaznaczone jako "___"
  const segments = pytanie.tresc.split('___')
  const answers = value ? value.split(',') : Array(segments.length - 1).fill('')

  const setAnswer = (idx: number, val: string) => {
    const next = [...answers]
    next[idx] = val
    onChange(next.join(','))
  }

  return (
    <Box>
      <Typography fontWeight={600} mb={2} fontSize="1rem">
        Uzupełnij brakujące słowa:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, lineHeight: 2.5 }}>
        {segments.map((seg, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography component="span" variant="body1">
              {seg}
            </Typography>
            {i < segments.length - 1 && (
              <TextField
                size="small"
                variant="standard"
                value={answers[i] ?? ''}
                onChange={(e) => setAnswer(i, e.target.value)}
                placeholder={`luka ${i + 1}`}
                sx={{ width: 120 }}
                inputProps={{ style: { textAlign: 'center' } }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
