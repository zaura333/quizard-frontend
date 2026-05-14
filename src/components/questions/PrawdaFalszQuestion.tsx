import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import type { PytaniePrawdaFalsz } from '../../types/api'

interface Props {
  pytanie: PytaniePrawdaFalsz
  value: string
  onChange: (v: string) => void
}

export default function PrawdaFalszQuestion({ pytanie, value, onChange }: Props) {
  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel sx={{ fontWeight: 600, mb: 1, color: 'text.primary', fontSize: '1rem' }}>
        {pytanie.tresc}
      </FormLabel>
      <RadioGroup row value={value} onChange={(e) => onChange(e.target.value)}>
        <FormControlLabel value="true" control={<Radio color="success" />} label="✅ Prawda" />
        <FormControlLabel value="false" control={<Radio color="error" />} label="❌ Fałsz" />
      </RadioGroup>
    </FormControl>
  )
}
