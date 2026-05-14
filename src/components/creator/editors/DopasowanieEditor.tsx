import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useFieldArray, useFormContext } from 'react-hook-form'

export default function DopasowanieEditor() {
  const { register, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name: 'pary' })

  return (
    <Box>
      <TextField
        {...register('tresc', { required: 'Treść pytania jest wymagana' })}
        label="Treść pytania"
        fullWidth
        multiline
        rows={2}
        error={!!errors.tresc}
        helperText={errors.tresc?.message as string}
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Pary do dopasowania (lewa → prawa)
      </Typography>

      {fields.map((field, i) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
          <TextField
            {...register(`pary.${i}.lewy`, { required: true })}
            size="small"
            placeholder="Element lewy"
            sx={{ flex: 1 }}
          />
          <Typography color="text.secondary">→</Typography>
          <TextField
            {...register(`pary.${i}.prawy`, { required: true })}
            size="small"
            placeholder="Element prawy"
            sx={{ flex: 1 }}
          />
          <IconButton size="small" onClick={() => remove(i)} disabled={fields.length <= 2}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        size="small"
        onClick={() => append({ lewy: '', prawy: '' })}
        sx={{ mb: 2 }}
      >
        Dodaj parę
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
