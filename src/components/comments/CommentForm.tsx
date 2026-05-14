import { Box, Button, TextField, Alert } from '@mui/material'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addComment } from '../../api/quiz.api'

interface Props {
  quizId: number
}

export default function CommentForm({ quizId }: Props) {
  const [text, setText] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => addComment(quizId, text.trim()),
    onSuccess: () => {
      setText('')
      queryClient.invalidateQueries({ queryKey: ['comments', quizId] })
    },
  })

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}>
      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          Nie udało się dodać komentarza.
        </Alert>
      )}
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Napisz komentarz…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        size="small"
        sx={{ mb: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        size="small"
        disabled={!text.trim() || mutation.isPending}
      >
        Dodaj komentarz
      </Button>
    </Box>
  )
}
