import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import type { CreateQuizRequest, QuizTypeInput } from '../../types/api'
import {
  ALL_CATEGORIES,
  ALL_QUIZ_TYPES_INPUT,
  CATEGORY_LABELS,
  QUIZ_TYPE_INPUT_LABELS,
} from '../../types/api'

// useFieldArray wymaga tablicy obiektów — lokalny typ formularza
type FormValues = Omit<CreateQuizRequest, 'mozliweWyniki' | 'poziomy'> & {
  mozliweWyniki: { value: string }[]
  poziomy: { value: string }[]
}

interface Props {
  defaultValues?: Partial<CreateQuizRequest>
  onSubmit: (data: CreateQuizRequest) => void
  isLoading?: boolean
  error?: string
  /** Jeśli true — typ quizu jest zablokowany (edycja istniejącego) */
  lockType?: boolean
}

const TIMER_TYPES: QuizTypeInput[] = ['TEST_WIEDZY', 'DOPASOWANIA', 'UZUPELNIANIE_LUK']

export default function QuizMetaForm({ defaultValues, onSubmit, isLoading, error, lockType }: Props) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: 'INNE',
      quizType: 'TEST_WIEDZY',
      limitCzasuSekundy: undefined,
      mozliweWyniki: (defaultValues?.mozliweWyniki ?? []).map((v) => ({ value: v })),
      poziomy: (defaultValues?.poziomy ?? []).map((v) => ({ value: v })),
      ...defaultValues
        ? { title: defaultValues.title ?? '', description: defaultValues.description ?? '', category: defaultValues.category ?? 'INNE', quizType: defaultValues.quizType ?? 'TEST_WIEDZY', limitCzasuSekundy: defaultValues.limitCzasuSekundy ?? undefined }
        : {},
    },
  })

  const quizType = watch('quizType')
  const hasTimer = TIMER_TYPES.includes(quizType)
  const isOsobowosci = quizType === 'OSOBOWOSCI'
  const isRanking = quizType === 'RANKING'

  const { fields: wynikFields, append: appendWynik, remove: removeWynik } =
    useFieldArray({ control, name: 'mozliweWyniki' })

  const { fields: poziomFields, append: appendPoziom, remove: removePoziom } =
    useFieldArray({ control, name: 'poziomy' })

  const handleFormSubmit = handleSubmit((data: FormValues) => {
    onSubmit({
      ...data,
      mozliweWyniki: data.mozliweWyniki.map((w) => w.value).filter(Boolean),
      poziomy: data.poziomy.map((p) => p.value).filter(Boolean),
    })
  })

  return (
    <Box component="form" onSubmit={handleFormSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2.5}>
        <TextField
          {...register('title', { required: 'Tytuł jest wymagany' })}
          label="Tytuł quizu"
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField
          {...register('description')}
          label="Opis (opcjonalny)"
          fullWidth
          multiline
          rows={3}
        />

        <Controller
          name="category"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Kategoria</InputLabel>
              <Select {...field} label="Kategoria">
                {ALL_CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>{CATEGORY_LABELS[c]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="quizType"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth disabled={lockType}>
              <InputLabel>Typ quizu</InputLabel>
              <Select {...field} label="Typ quizu">
                {ALL_QUIZ_TYPES_INPUT.map((t) => (
                  <MenuItem key={t} value={t}>{QUIZ_TYPE_INPUT_LABELS[t]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {hasTimer && (
          <TextField
            {...register('limitCzasuSekundy', { valueAsNumber: true })}
            label="Limit czasu (sekundy) — pozostaw puste, aby wyłączyć"
            type="number"
            fullWidth
            inputProps={{ min: 10 }}
          />
        )}

        {isOsobowosci && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Możliwe wyniki osobowości
            </Typography>
            {wynikFields.map((field, i) => (
              <Box key={field.id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  {...register(`mozliweWyniki.${i}.value`, { required: true })}
                  size="small"
                  fullWidth
                  placeholder={`Wynik ${i + 1}`}
                />
                <IconButton size="small" onClick={() => removeWynik(i)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={() => appendWynik({ value: '' })}
            >
              Dodaj wynik
            </Button>
          </Box>
        )}

        {isRanking && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Poziomy tierlisty (puste = domyślne S/A/B/C/D)
            </Typography>
            {poziomFields.length === 0 && (
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                {['S', 'A', 'B', 'C', 'D'].map((p) => (
                  <Chip key={p} label={p} size="small" />
                ))}
              </Box>
            )}
            {poziomFields.map((field, i) => (
              <Box key={field.id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  {...register(`poziomy.${i}.value`, { required: true })}
                  size="small"
                  fullWidth
                  placeholder={`Poziom ${i + 1}`}
                />
                <IconButton size="small" onClick={() => removePoziom(i)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={() => appendPoziom({ value: '' })}
            >
              Dodaj poziom
            </Button>
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
        >
          {isLoading ? 'Zapisywanie…' : 'Dalej — dodaj pytania'}
        </Button>
      </Stack>
    </Box>
  )
}
