import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export default function PrawdaFalszEditor() {
  const { register, control, formState: { errors } } = useFormContext()

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

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel>Poprawna odpowiedź</FormLabel>
        <Controller
          name="poprawnaOdpowiedz"
          control={control}
          defaultValue="true"
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel value="true" control={<Radio />} label="Prawda" />
              <FormControlLabel value="false" control={<Radio />} label="Fałsz" />
            </RadioGroup>
          )}
        />
      </FormControl>

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
