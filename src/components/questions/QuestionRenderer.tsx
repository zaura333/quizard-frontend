import { Paper, Typography, Chip } from '@mui/material'
import type { Pytanie } from '../../types/api'
import StandardQuestion from './StandardQuestion'
import MultiWyborQuestion from './MultiWyborQuestion'
import PrawdaFalszQuestion from './PrawdaFalszQuestion'
import OsobowosciQuestion from './OsobowosciQuestion'
import DopasowanieQuestion from './DopasowanieQuestion'
import UzupelnianieLukQuestion from './UzupelnianieLukQuestion'

interface Props {
  pytanie: Pytanie
  index: number
  value: string
  onChange: (v: string) => void
}

export default function QuestionRenderer({ pytanie, index, value, onChange }: Props) {
  const renderBody = () => {
    switch (pytanie.pytanieType) {
      case 'STANDARD':
        return <StandardQuestion pytanie={pytanie} value={value} onChange={onChange} />
      case 'MULTI_WYBOR':
        return <MultiWyborQuestion pytanie={pytanie} value={value} onChange={onChange} />
      case 'PRAWDA_FALSZ':
        return <PrawdaFalszQuestion pytanie={pytanie} value={value} onChange={onChange} />
      case 'OSOBOWOSCI':
        return <OsobowosciQuestion pytanie={pytanie} value={value} onChange={onChange} />
      case 'DOPASOWANIE':
        return <DopasowanieQuestion pytanie={pytanie} value={value} onChange={onChange} />
      case 'UZUPELNIANIE_LUK':
        return <UzupelnianieLukQuestion pytanie={pytanie} value={value} onChange={onChange} />
      case 'ELEMENT_RANKINGU':
        return null  // obsługiwane osobno w RankingResult
      default:
        return null
    }
  }

  const body = renderBody()
  if (!body) return null

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
      <Chip
        label={`Pytanie ${index + 1}`}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ mb: 1.5 }}
      />
      {pytanie.podpowiedz && (
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          💡 {pytanie.podpowiedz}
        </Typography>
      )}
      {body}
    </Paper>
  )
}
