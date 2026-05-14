import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import type { PytanieStandard } from '../../types/api'

interface Props {
  pytanie: PytanieStandard
  value: string
  onChange: (v: string) => void
}

export default function StandardQuestion({ pytanie, value, onChange }: Props) {
  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel sx={{ fontWeight: 600, mb: 1, color: 'text.primary', fontSize: '1rem' }}>
        {pytanie.tresc}
      </FormLabel>
      <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
        {pytanie.opcje.map((opcja) => (
          <FormControlLabel key={opcja} value={opcja} control={<Radio />} label={opcja} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
