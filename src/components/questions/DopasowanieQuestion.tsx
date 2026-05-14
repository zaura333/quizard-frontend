import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Box,
} from '@mui/material'
import type { PytanieDopasowanie } from '../../types/api'

interface Props {
  pytanie: PytanieDopasowanie
  value: string    // "lewy1:prawy1,lewy2:prawy2"
  onChange: (v: string) => void
}

/** Parsuje JSON odpowiedzi → mapa lewy→prawy */
const parseValue = (value: string): Record<string, string> => {
  if (!value) return {}
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

/** Serializuje mapę → JSON */
const serialize = (map: Record<string, string>): string =>
  JSON.stringify(map)

export default function DopasowanieQuestion({ pytanie, value, onChange }: Props) {
  const pairs = parseValue(value)

  const setRight = (lewy: string, prawy: string) => {
    const updated = { ...pairs, [lewy]: prawy }
    onChange(serialize(updated))
  }

  return (
    <Box>
      <Typography fontWeight={600} mb={2} fontSize="1rem">
        {pytanie.tresc}
      </Typography>
      <Stack spacing={2}>
        {pytanie.lewaKolumna.map((lewy) => (
          <Box key={lewy} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ minWidth: 180, fontWeight: 500 }}>{lewy}</Typography>
            <Typography color="text.secondary">→</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Wybierz</InputLabel>
              <Select
                value={pairs[lewy] ?? ''}
                label="Wybierz"
                onChange={(e) => setRight(lewy, e.target.value)}
              >
                <MenuItem value="">—</MenuItem>
                {pytanie.prawaKolumna.map((prawy) => (
                  <MenuItem key={prawy} value={prawy}>
                    {prawy}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
