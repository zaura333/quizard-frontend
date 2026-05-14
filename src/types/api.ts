// ─── Enums / primitives ───────────────────────────────────────────────────────

export type Role = 'ADMIN' | 'USER'
export type QuizStatus = 'DRAFT' | 'PUBLISHED'

export type Category =
  | 'NAUKA'
  | 'HISTORIA'
  | 'GEOGRAFIA'
  | 'SPORT'
  | 'ROZRYWKA'
  | 'TECHNOLOGIA'
  | 'SZTUKA'
  | 'MUZYKA'
  | 'FILM'
  | 'LITERATURA'
  | 'INNE'

/** Wartość quizType w odpowiedzi backendu (SimpleClassName) */
export type QuizTypeName =
  | 'TestWiedzy'
  | 'QuizOsobowosci'
  | 'QuizDopasowania'
  | 'UzupelnianieLukQuiz'
  | 'Ranking'

/** Wartość quizType w żądaniu tworzenia/edycji */
export type QuizTypeInput =
  | 'TEST_WIEDZY'
  | 'OSOBOWOSCI'
  | 'DOPASOWANIA'
  | 'UZUPELNIANIE_LUK'
  | 'RANKING'

export type PytanieType =
  | 'STANDARD'
  | 'MULTI_WYBOR'
  | 'PRAWDA_FALSZ'
  | 'OSOBOWOSCI'
  | 'DOPASOWANIE'
  | 'UZUPELNIANIE_LUK'
  | 'ELEMENT_RANKINGU'

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: number
  username: string
  email: string | null
  role: Role
  createdAt: string
}

// ─── Quiz ────────────────────────────────────────────────────────────────────

export interface QuizSummaryResponse {
  id: number
  title: string
  description: string | null
  category: Category
  status: QuizStatus
  quizType: QuizTypeName
  author: UserResponse | null
  likesCount: number
  questionsCount: number
  limitCzasuSekundy: number | null
  poziomy: string[] | null          // Ranking — poziomy tierlisty
  mozliweWyniki: string[] | null    // QuizOsobowosci — możliwe wyniki
  createdAt: string
  updatedAt: string
}

export interface SpringPage<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number   // 0-indexed
  size: number
}

export interface CreateQuizRequest {
  title: string
  description?: string
  category: Category
  quizType: QuizTypeInput
  limitCzasuSekundy?: number | null
  mozliweWyniki?: string[]
  poziomy?: string[]
}

// ─── Pytania (discriminated union) ───────────────────────────────────────────

interface PytanieBase {
  id: number
  tresc: string
  kolejnosc: number
  pytanieType: PytanieType
  podpowiedz?: string | null
}

export interface PytanieStandard extends PytanieBase {
  pytanieType: 'STANDARD'
  opcje: string[]
  punkty: number
}

export interface PytanieMultiWybor extends PytanieBase {
  pytanieType: 'MULTI_WYBOR'
  opcje: string[]
  punkty: number
}

export interface PytaniePrawdaFalsz extends PytanieBase {
  pytanieType: 'PRAWDA_FALSZ'
  punkty: number
}

export interface PytanieOsobowosci extends PytanieBase {
  pytanieType: 'OSOBOWOSCI'
  opcjeDoWynikow: Record<string, string>  // opcja → wynik osobowości
}

export interface PytanieDopasowanie extends PytanieBase {
  pytanieType: 'DOPASOWANIE'
  lewaKolumna: string[]
  prawaKolumna: string[]
  punkty: number
}

export interface PytanieUzupelnianieLuk extends PytanieBase {
  pytanieType: 'UZUPELNIANIE_LUK'
  // tresc zawiera "___" jako placeholdery luk
  punkty: number
}

export interface PytanieElementRankingu extends PytanieBase {
  pytanieType: 'ELEMENT_RANKINGU'
  // tresc = nazwa elementu do ułożenia w tierliście
}

export type Pytanie =
  | PytanieStandard
  | PytanieMultiWybor
  | PytaniePrawdaFalsz
  | PytanieOsobowosci
  | PytanieDopasowanie
  | PytanieUzupelnianieLuk
  | PytanieElementRankingu

// ─── Create question requests ─────────────────────────────────────────────────

interface CreateQuestionBase {
  pytanieType: PytanieType
  tresc: string
  kolejnosc: number
  podpowiedz?: string
}

export interface CreateStandardRequest extends CreateQuestionBase {
  pytanieType: 'STANDARD'
  opcje: string[]
  poprawnaOdpowiedz: string
  punkty: number
}

export interface CreateMultiWyborRequest extends CreateQuestionBase {
  pytanieType: 'MULTI_WYBOR'
  opcje: string[]
  poprawneOdpowiedzi: string   // CSV
  punkty: number
}

export interface CreatePrawdaFalszRequest extends CreateQuestionBase {
  pytanieType: 'PRAWDA_FALSZ'
  poprawnaOdpowiedz: boolean
  punkty: number
}

export interface CreateOsobowosciRequest extends CreateQuestionBase {
  pytanieType: 'OSOBOWOSCI'
  opcjeDoWynikow: Record<string, string>
}

export interface CreateDopasowanieRequest extends CreateQuestionBase {
  pytanieType: 'DOPASOWANIE'
  lewaKolumna: string[]
  prawaKolumna: string[]
  poprawneParry: Record<string, string>
  punkty: number
}

export interface CreateUzupelnianieLukRequest extends CreateQuestionBase {
  pytanieType: 'UZUPELNIANIE_LUK'
  listaPoprawnych: string[]
  punkty: number
}

export interface CreateElementRankinguRequest extends CreateQuestionBase {
  pytanieType: 'ELEMENT_RANKINGU'
}

export type CreateQuestionRequest =
  | CreateStandardRequest
  | CreateMultiWyborRequest
  | CreatePrawdaFalszRequest
  | CreateOsobowosciRequest
  | CreateDopasowanieRequest
  | CreateUzupelnianieLukRequest
  | CreateElementRankinguRequest

// ─── Attempt ─────────────────────────────────────────────────────────────────

export interface AnswerDto {
  questionId: number
  answer: string
}

export interface AttemptRequest {
  answers: AnswerDto[]
  startedAtEpochMs: number
}

export interface QuestionResult {
  questionId: number
  pytanieType: PytanieType
  correct: boolean
  pointsEarned: number
  maxPoints: number
  correctAnswer: string
  givenAnswer: string
}

export interface AttemptResult {
  quizId: number
  quizType: QuizTypeName
  // quizy oceniane
  totalPoints?: number
  maxPoints?: number
  percentScore?: number
  questionResults?: QuestionResult[]
  // quiz osobowości
  personalityResult?: string
  personalityVotes?: Record<string, number>
}

// ─── Komentarze ───────────────────────────────────────────────────────────────

export interface KomentarzResponse {
  id: number
  tresc: string
  author: UserResponse | null
  createdAt: string
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<Category, string> = {
  NAUKA: 'Nauka',
  HISTORIA: 'Historia',
  GEOGRAFIA: 'Geografia',
  SPORT: 'Sport',
  ROZRYWKA: 'Rozrywka',
  TECHNOLOGIA: 'Technologia',
  SZTUKA: 'Sztuka',
  MUZYKA: 'Muzyka',
  FILM: 'Film',
  LITERATURA: 'Literatura',
  INNE: 'Inne',
}

export const QUIZ_TYPE_LABELS: Record<QuizTypeName, string> = {
  TestWiedzy: 'Test wiedzy',
  QuizOsobowosci: 'Quiz osobowości',
  QuizDopasowania: 'Dopasowanie',
  UzupelnianieLukQuiz: 'Uzupełnianie luk',
  Ranking: 'Ranking (tierlist)',
}

export const QUIZ_TYPE_INPUT_LABELS: Record<QuizTypeInput, string> = {
  TEST_WIEDZY: 'Test wiedzy',
  OSOBOWOSCI: 'Quiz osobowości',
  DOPASOWANIA: 'Dopasowanie',
  UZUPELNIANIE_LUK: 'Uzupełnianie luk',
  RANKING: 'Ranking (tierlist)',
}

/** Mapa SimpleClassName → input enum (do edycji istniejącego quizu) */
export const QUIZ_TYPE_NAME_TO_INPUT: Record<QuizTypeName, QuizTypeInput> = {
  TestWiedzy: 'TEST_WIEDZY',
  QuizOsobowosci: 'OSOBOWOSCI',
  QuizDopasowania: 'DOPASOWANIA',
  UzupelnianieLukQuiz: 'UZUPELNIANIE_LUK',
  Ranking: 'RANKING',
}

/** Typy pytań dostępne dla danego typu quizu */
export const QUESTION_TYPES_FOR_QUIZ: Record<QuizTypeInput, PytanieType[]> = {
  TEST_WIEDZY: ['STANDARD', 'MULTI_WYBOR', 'PRAWDA_FALSZ'],
  OSOBOWOSCI: ['OSOBOWOSCI'],
  DOPASOWANIA: ['DOPASOWANIE'],
  UZUPELNIANIE_LUK: ['UZUPELNIANIE_LUK'],
  RANKING: ['ELEMENT_RANKINGU'],
}

export const PYTANIE_TYPE_LABELS: Record<PytanieType, string> = {
  STANDARD: 'Jedna odpowiedź',
  MULTI_WYBOR: 'Wielokrotny wybór',
  PRAWDA_FALSZ: 'Prawda / Fałsz',
  OSOBOWOSCI: 'Pytanie osobowości',
  DOPASOWANIE: 'Dopasowanie par',
  UZUPELNIANIE_LUK: 'Uzupełnianie luk',
  ELEMENT_RANKINGU: 'Element rankingu',
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]
export const ALL_QUIZ_TYPES_INPUT = Object.keys(QUIZ_TYPE_INPUT_LABELS) as QuizTypeInput[]
