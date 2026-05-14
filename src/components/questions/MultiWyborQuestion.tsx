import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material'
import type { PytanieMultiWybor } from '../../types/api'

interface Props {
  pytanie: PytanieMultiWybor
  value: string      // CSV posortowany
  onChange: (v: string) => void
}

export default function MultiWyborQuestion({ pytanie, value, onChange }: Props) {
  const selected = value ? value.split(',').filter(Boolean) : []

  const toggle = (opcja: string) => {
    const next = selected.includes(opcja)
      ? selected.filter((o) => o !== opcja)
      : [...selected, opcja]
    onChange(next.sort().join(','))
  }

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel sx={{ fontWeight: 600, mb: 1, color: 'text.primary', fontSize: '1rem' }}>
        {pytanie.tresc}
        <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#666', marginLeft: 8 }}>
          (może być kilka odpowiedzi)
        </span>
      </FormLabel>
      <FormGroup>
        {pytanie.opcje.map((opcja) => (
          <FormControlLabel
            key={opcja}
            control={
              <Checkbox
                checked={selected.includes(opcja)}
                onChange={() => toggle(opcja)}
              />
            }
            label={opcja}
          />
        ))}
      </FormGroup>
    </FormControl>
  )
}
