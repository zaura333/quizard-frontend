import { useState } from 'react'
import type { AnswerDto, Pytanie } from '../types/api'

/**
 * Zarządza stanem odpowiedzi użytkownika podczas rozwiązywania quizu.
 * answers: Record<questionId, string> — format zależy od typu pytania.
 */
export const useQuizSolver = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [startedAt] = useState<number>(Date.now())

  const setAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const buildAnswerDtos = (questions: Pytanie[]): AnswerDto[] =>
    questions
      .filter((q) => q.pytanieType !== 'ELEMENT_RANKINGU')
      .map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? '',
      }))

  const isAnswered = (questionId: number) =>
    answers[questionId] !== undefined && answers[questionId] !== ''

  const answeredCount = (questions: Pytanie[]) =>
    questions.filter(
      (q) => q.pytanieType !== 'ELEMENT_RANKINGU' && isAnswered(q.id)
    ).length

  return { answers, setAnswer, buildAnswerDtos, isAnswered, answeredCount, startedAt }
}
