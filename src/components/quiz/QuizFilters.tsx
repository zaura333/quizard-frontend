import { Box, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material'
import type { Category } from '../../types/api'
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../../types/api'

interface Props {
  category: Category | ''
  onCategoryChange: (v: Category | '') => void
  onReset: () => void
}

export default function QuizFilters({ category, onCategoryChange, onReset }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Kategoria</InputLabel>
        <Select
          value={category}
          label="Kategoria"
          onChange={(e) => onCategoryChange(e.target.value as Category | '')}
        >
          <MenuItem value="">Wszystkie</MenuItem>
          {ALL_CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {category && (
        <Button size="small" variant="text" onClick={onReset}>
          Resetuj filtry
        </Button>
      )}
    </Box>
  )
}
