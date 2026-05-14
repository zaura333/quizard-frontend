import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addQuestion } from '../../api/question.api'
import type {
  CreateQuestionRequest,
  PytanieType,
  QuizTypeInput,
} from '../../types/api'
import { PYTANIE_TYPE_LABELS, QUESTION_TYPES_FOR_QUIZ } from '../../types/api'
import StandardEditor from './editors/StandardEditor'
import MultiWyborEditor from './editors/MultiWyborEditor'
import PrawdaFalszEditor from './editors/PrawdaFalszEditor'
import OsobowosciEditor from './editors/OsobowosciEditor'
import DopasowanieEditor from './editors/DopasowanieEditor'
import UzupelnianieLukEditor from './editors/UzupelnianieLukEditor'
import ElementRankinguEditor from './editors/ElementRankinguEditor'

interface Props {
  open: boolean
  onClose: () => void
  quizId: number
  quizType: QuizTypeInput
  nextKolejnosc: number
  mozliweWyniki?: string[]
}

export default function QuestionEditor({
  open,
  onClose,
  quizId,
  quizType,
  nextKolejnosc,
  mozliweWyniki = [],
}: Props) {
  const availableTypes = QUESTION_TYPES_FOR_QUIZ[quizType]
  const [pytanieType, setPytanieType] = useState<PytanieType>(availableTypes[0])
  const queryClient = useQueryClient()

  const methods = useForm({ defaultValues: { tresc: '', punkty: 1, opcje: [{ value: '' }, { value: '' }] } })

  const mutation = useMutation({
    mutationFn: (data: CreateQuestionRequest) => addQuestion(quizId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', quizId] })
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
      methods.reset()
      onClose()
    },
  })

  const onSubmit = methods.handleSubmit((raw) => {
    let req: CreateQuestionRequest

    if (pytanieType === 'STANDARD') {
      req = {
        pytanieType: 'STANDARD',
        tresc: raw.tresc,
        kolejnosc: nextKolejnosc,
        opcje: raw.opcje.map((o: { value: string }) => o.value),
        poprawnaOdpowiedz: raw.poprawnaOdpowiedz,
        punkty: raw.punkty,
      }
    } else if (pytanieType === 'MULTI_WYBOR') {
      req = {
        pytanieType: 'MULTI_WYBOR',
        tresc: raw.tresc,
        kolejnosc: nextKolejnosc,
        opcje: raw.opcje.map((o: { value: string }) => o.value),
        poprawneOdpowiedzi: raw.poprawneOdpowiedzi ?? '',
        punkty: raw.punkty,
      }
    } else if (pytanieType === 'PRAWDA_FALSZ') {
      req = {
        pytanieType: 'PRAWDA_FALSZ',
        tresc: raw.tresc,
        kolejnosc: nextKolejnosc,
        poprawnaOdpowiedz: raw.poprawnaOdpowiedz === 'true',
        punkty: raw.punkty,
      }
    } else if (pytanieType === 'OSOBOWOSCI') {
      const opcjeDoWynikow: Record<string, string> = {}
      ;(raw.opcjeWyniki ?? []).forEach((o: { opcja: string; wynik: string }) => {
        opcjeDoWynikow[o.opcja] = o.wynik
      })
      req = {
        pytanieType: 'OSOBOWOSCI',
        tresc: raw.tresc,
        kolejnosc: nextKolejnosc,
        opcjeDoWynikow,
      }
    } else if (pytanieType === 'DOPASOWANIE') {
      const pary: { lewy: string; prawy: string }[] = raw.pary ?? []
      req = {
        pytanieType: 'DOPASOWANIE',
        tresc: raw.tresc,
        kolejnosc: nextKolejnosc,
        lewaKolumna: pary.map((p) => p.lewy),
        prawaKolumna: pary.map((p) => p.prawy),
        poprawneParry: Object.fromEntries(pary.map((p) => [p.lewy, p.prawy])),
        punkty: raw.punkty,
      }
    } else if (pytanieType === 'UZUPELNIANIE_LUK') {
      req = {
        pytanieType: 'UZUPELNIANIE_LUK',
        tresc: raw.tresc,
        kolejnosc: nextKolejnosc,
        listaPoprawnych: (raw.odpowiedzi ?? []).map((o: { value: string }) => o.value),
        punkty: raw.punkty,
      }
    } else {
      req = {
        pytanieType: 'ELEMENT_RANKINGU',
        tresc: raw.tresc,
        kolejnosc: nextKolejnosc,
      }
    }

    mutation.mutate(req)
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dodaj pytanie</DialogTitle>
      <DialogContent>
        {availableTypes.length > 1 && (
          <FormControl fullWidth size="small" sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Typ pytania</InputLabel>
            <Select
              value={pytanieType}
              label="Typ pytania"
              onChange={(e) => {
                setPytanieType(e.target.value as PytanieType)
                methods.reset()
              }}
            >
              {availableTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {PYTANIE_TYPE_LABELS[t]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Nie udało się zapisać pytania.
          </Alert>
        )}

        <FormProvider {...methods}>
          <Box>
            {pytanieType === 'STANDARD' && <StandardEditor />}
            {pytanieType === 'MULTI_WYBOR' && <MultiWyborEditor />}
            {pytanieType === 'PRAWDA_FALSZ' && <PrawdaFalszEditor />}
            {pytanieType === 'OSOBOWOSCI' && <OsobowosciEditor mozliweWyniki={mozliweWyniki} />}
            {pytanieType === 'DOPASOWANIE' && <DopasowanieEditor />}
            {pytanieType === 'UZUPELNIANIE_LUK' && <UzupelnianieLukEditor />}
            {pytanieType === 'ELEMENT_RANKINGU' && <ElementRankinguEditor />}
          </Box>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button variant="contained" onClick={onSubmit} disabled={mutation.isPending}>
          Zapisz pytanie
        </Button>
      </DialogActions>
    </Dialog>
  )
}
