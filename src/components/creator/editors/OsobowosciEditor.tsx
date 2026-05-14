import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useFieldArray, useFormContext } from 'react-hook-form'

interface Props {
  mozliweWyniki: string[]
}

export default function OsobowosciEditor({ mozliweWyniki }: Props) {
  const { register, control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name: 'opcjeWyniki', control })

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
        Opcje → wynik osobowości
      </Typography>

      {fields.map((field, i) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
          <TextField
            {...register(`opcjeWyniki.${i}.opcja`, { required: true })}
            size="small"
            placeholder="Treść opcji"
            sx={{ flex: 1 }}
          />
          <Typography color="text.secondary">→</Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Wynik</InputLabel>
            <Select
              defaultValue=""
              label="Wynik"
              {...register(`opcjeWyniki.${i}.wynik`, { required: true })}
            >
              {mozliweWyniki.map((w) => (
                <MenuItem key={w} value={w}>{w}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton size="small" onClick={() => remove(i)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        size="small"
        onClick={() => append({ opcja: '', wynik: '' })}
      >
        Dodaj opcję
      </Button>
    </Box>
  )
}
