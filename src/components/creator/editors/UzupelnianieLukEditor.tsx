import { Alert, Box, Button, IconButton, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

export default function UzupelnianieLukEditor() {
  const { register, control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name: 'odpowiedzi', control })
  const tresc = useWatch({ control, name: 'tresc' }) ?? ''
  const lukCount = tresc.split('___').length - 1

  return (
    <Box>
      <TextField
        {...register('tresc', { required: 'Treść pytania jest wymagana' })}
        label="Treść pytania"
        fullWidth
        multiline
        rows={3}
        error={!!errors.tresc}
        helperText={errors.tresc?.message as string ?? 'Użyj ___ jako placeholdera luki, np. "Stolica Polski to ___."'}
        sx={{ mb: 1 }}
      />

      {lukCount > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Wykryto {lukCount} luk{lukCount === 1 ? 'ę' : lukCount < 5 ? 'i' : ''}. Podaj odpowiedzi w kolejności.
        </Alert>
      )}

      <Typography variant="subtitle2" gutterBottom>
        Poprawne odpowiedzi (po jednej na lukę, kolejno)
      </Typography>

      {fields.map((field, i) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
          <Typography color="text.secondary" sx={{ minWidth: 24 }}>
            {i + 1}.
          </Typography>
          <TextField
            {...register(`odpowiedzi.${i}.value`, { required: true })}
            size="small"
            fullWidth
            placeholder={`Luka ${i + 1}`}
          />
          <IconButton size="small" onClick={() => remove(i)} disabled={fields.length <= 1}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        size="small"
        onClick={() => append({ value: '' })}
        sx={{ mb: 2 }}
      >
        Dodaj odpowiedź
      </Button>

      <TextField
        {...register('punkty', { required: true, min: 1, valueAsNumber: true })}
        label="Punkty"
        type="number"
        size="small"
        sx={{ width: 100 }}
        defaultValue={1}
        inputProps={{ min: 1 }}
      />
    </Box>
  )
}
