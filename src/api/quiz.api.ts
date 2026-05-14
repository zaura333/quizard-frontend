import api from './axios'
import type {
  AttemptRequest,
  AttemptResult,
  CreateQuizRequest,
  Category,
  KomentarzResponse,
  QuizSummaryResponse,
  SpringPage,
} from '../types/api'

export interface GetQuizzesParams {
  category?: Category
  authorId?: number
  page?: number
  size?: number
}

export const getQuizzes = (params: GetQuizzesParams = {}) =>
  api
    .get<SpringPage<QuizSummaryResponse>>('/quizzes', { params })
    .then((r) => r.data)

export const getQuiz = (id: number) =>
  api.get<QuizSummaryResponse>(`/quizzes/${id}`).then((r) => r.data)

export const createQuiz = (data: CreateQuizRequest) =>
  api.post<QuizSummaryResponse>('/quizzes', data).then((r) => r.data)

export const updateQuiz = (id: number, data: CreateQuizRequest) =>
  api.put<QuizSummaryResponse>(`/quizzes/${id}`, data).then((r) => r.data)

export const publishQuiz = (id: number) =>
  api.put<void>(`/quizzes/${id}/publish`).then((r) => r.data)

export const deleteQuiz = (id: number) =>
  api.delete<void>(`/quizzes/${id}`).then((r) => r.data)

export const submitAttempt = (id: number, data: AttemptRequest) =>
  api.post<AttemptResult>(`/quizzes/${id}/attempt`, data).then((r) => r.data)

// ─── Komentarze ──────────────────────────────────────────────────────────────

export const getComments = (quizId: number, page = 0) =>
  api
    .get<SpringPage<KomentarzResponse>>(`/quizzes/${quizId}/comments`, {
      params: { page, size: 20 },
    })
    .then((r) => r.data)

export const addComment = (quizId: number, tresc: string) =>
  api
    .post<KomentarzResponse>(`/quizzes/${quizId}/comments`, { tresc })
    .then((r) => r.data)

export const deleteComment = (quizId: number, commentId: number) =>
  api.delete<void>(`/quizzes/${quizId}/comments/${commentId}`).then((r) => r.data)

// ─── Polubienia ───────────────────────────────────────────────────────────────

export const likeQuiz = (id: number) =>
  api.post<{ liked: boolean }>(`/quizzes/${id}/like`).then((r) => r.data)

export const unlikeQuiz = (id: number) =>
  api.delete<{ liked: boolean }>(`/quizzes/${id}/like`).then((r) => r.data)
