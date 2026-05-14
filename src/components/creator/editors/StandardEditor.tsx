import { Box, Button, IconButton, Radio, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useFieldArray, useFormContext } from 'react-hook-form'

export default function StandardEditor() {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name: 'opcje' })
  const poprawna = watch('poprawnaOdpowiedz')

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
        Opcje odpowiedzi (zaznacz poprawną)
      </Typography>

      {fields.map((field, i) => (
        <Box key={field.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Radio
            checked={poprawna === watch(`opcje.${i}.value`)}
            onChange={() => setValue('poprawnaOdpowiedz', watch(`opcje.${i}.value`))}
            size="small"
          />
          <TextField
            {...register(`opcje.${i}.value`, { required: true })}
            size="small"
            fullWidth
            placeholder={`Opcja ${i + 1}`}
          />
          <IconButton onClick={() => remove(i)} disabled={fields.length <= 2} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button startIcon={<AddIcon />} size="small" onClick={() => append({ value: '' })} sx={{ mb: 2 }}>
        Dodaj opcję
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
