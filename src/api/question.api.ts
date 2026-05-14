import api from './axios'
import type { CreateQuestionRequest, Pytanie } from '../types/api'

export const getQuestions = (quizId: number) =>
  api.get<Pytanie[]>(`/quizzes/${quizId}/questions`).then((r) => r.data)

export const addQuestion = (quizId: number, data: CreateQuestionRequest) =>
  api.post<Pytanie>(`/quizzes/${quizId}/questions`, data).then((r) => r.data)

export const updateQuestion = (
  quizId: number,
  questionId: number,
  data: CreateQuestionRequest
) =>
  api
    .put<Pytanie>(`/quizzes/${quizId}/questions/${questionId}`, data)
    .then((r) => r.data)

export const deleteQuestion = (quizId: number, questionId: number) =>
  api.delete<void>(`/quizzes/${quizId}/questions/${questionId}`).then((r) => r.data)
