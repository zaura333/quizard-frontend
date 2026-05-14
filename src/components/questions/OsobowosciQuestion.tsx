import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import type { PytanieOsobowosci } from '../../types/api'

interface Props {
  pytanie: PytanieOsobowosci
  value: string
  onChange: (v: string) => void
}

export default function OsobowosciQuestion({ pytanie, value, onChange }: Props) {
  const opcje = Object.keys(pytanie.opcjeDoWynikow)

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel sx={{ fontWeight: 600, mb: 1, color: 'text.primary', fontSize: '1rem' }}>
        {pytanie.tresc}
      </FormLabel>
      <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
        {opcje.map((opcja) => (
          <FormControlLabel key={opcja} value={opcja} control={<Radio />} label={opcja} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
