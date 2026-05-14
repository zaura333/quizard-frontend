import { Box, TextField } from '@mui/material'
import { useFormContext } from 'react-hook-form'

export default function ElementRankinguEditor() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <Box>
      <TextField
        {...register('tresc', { required: 'Nazwa elementu jest wymagana' })}
        label="Nazwa elementu rankingu"
        fullWidth
        error={!!errors.tresc}
        helperText={
          (errors.tresc?.message as string) ??
          'Np. "Merkury", "The Beatles", "Python" — element, który user przypisze do poziomu w tierliście.'
        }
      />
    </Box>
  )
}
