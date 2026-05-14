import { Box, Button, Checkbox, IconButton, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useFieldArray, useFormContext } from 'react-hook-form'

export default function MultiWyborEditor() {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name: 'opcje' })
  const poprawne: string = watch('poprawneOdpowiedzi') ?? ''
  const poprawneArr = poprawne ? poprawne.split(',').filter(Boolean) : []

  const toggle = (val: string) => {
    const next = poprawneArr.includes(val)
      ? poprawneArr.filter((v) => v !== val)
      : [...poprawneArr, val]
    setValue('poprawneOdpowiedzi', next.join(','))
  }

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
        Opcje (zaznacz poprawne — może być kilka)
      </Typography>

      {fields.map((field, i) => {
        const val = watch(`opcje.${i}.value`) ?? ''
        return (
          <Box key={field.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Checkbox
              checked={poprawneArr.includes(val)}
              onChange={() => toggle(val)}
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
        )
      })}

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
