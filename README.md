# Quizard — Frontend

Aplikacja webowa do tworzenia i rozwiązywania quizów. Frontend projektu **Quizard** zbudowany w React + TypeScript + Vite z Material UI.

---

## Wymagania

| Narzędzie | Wersja minimalna |
|---|---|
| Node.js | 20+ |
| npm | 10+ |
| Backend Quizard | uruchomiony na `localhost:8080` |

---

## Szybki start

### 1. Uruchom backend

Backend musi być dostępny na `http://localhost:8080`. Szczegóły w `quizard-backend/README.md`.

```bash
# W katalogu quizard-backend:
docker-compose up -d      # uruchom MySQL
mvn spring-boot:run       # uruchom Spring Boot
```

### 2. Zainstaluj zależności frontendu

```bash
cd quizard-frontend
npm install
```

### 3. Uruchom serwer deweloperski

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem **http://localhost:5173**.

Serwer Vite automatycznie proxy'uje żądania `/api/*` do `http://localhost:8080`, więc CORS nie wymaga dodatkowej konfiguracji.

---

## Konta testowe (z seed backendu)

| Użytkownik | Email | Hasło | Rola |
|---|---|---|---|
| admin | admin@quizard.pl | Admin123! | ADMIN |
| janek | janek@quizard.pl | Haslo123! | USER |
| ania | ania@quizard.pl | Haslo123! | USER |
| piotr | piotr@quizard.pl | Haslo123! | USER |
| kasia | kasia@quizard.pl | Haslo123! | USER |

---

## Dostępne skrypty

| Polecenie | Opis |
|---|---|
| `npm run dev` | Serwer deweloperski z hot reload (port 5173) |
| `npm run build` | Build produkcyjny do katalogu `dist/` |
| `npm run preview` | Podgląd buildu produkcyjnego lokalnie |

---

## Struktura projektu

```
src/
├── api/                  # Warstwa HTTP — axios + funkcje per endpoint
│   ├── axios.ts          # Instancja axios (withCredentials, interceptor 401)
│   ├── auth.api.ts
│   ├── quiz.api.ts
│   └── question.api.ts
├── store/                # Redux Toolkit — globalny stan auth
│   ├── store.ts
│   └── authSlice.ts
├── hooks/                # Custom hooks
│   ├── useAuth.ts        # Odczyt stanu auth ze store
│   ├── useTimer.ts       # Countdown timer dla quizów z limitem czasu
│   └── useQuizSolver.ts  # Zbieranie odpowiedzi użytkownika
├── types/
│   └── api.ts            # Wszystkie typy TypeScript + stałe (labels, mapy)
├── theme/
│   └── theme.ts          # MUI theme (kolor primary: fioletowy)
├── router/
│   └── AppRouter.tsx     # React Router — trasy + ProtectedRoute / GuestRoute
├── components/
│   ├── layout/           # AppBar, Layout
│   ├── quiz/             # QuizCard, QuizFilters, LikeButton, TimerBar
│   ├── questions/        # Komponenty renderowania pytań (per typ)
│   ├── results/          # ScoredResult, PersonalityResult, RankingResult
│   ├── creator/          # QuizMetaForm, QuestionList, QuestionEditor + edytory
│   └── comments/         # CommentList, CommentForm
├── pages/                # Strony aplikacji
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── QuizDetailPage.tsx
│   ├── QuizSolvePage.tsx
│   ├── QuizResultPage.tsx
│   ├── QuizCreatePage.tsx
│   ├── QuizEditPage.tsx
│   ├── MyQuizzesPage.tsx
│   └── NotFoundPage.tsx
├── App.tsx               # Root — Provider stack (Redux, QueryClient, MUI, Router)
└── main.tsx
```

---

## Routing

| Ścieżka | Strona | Dostęp |
|---|---|---|
| `/` | Lista quizów z filtrami | Publiczny |
| `/login` | Logowanie | Tylko niezalogowani |
| `/register` | Rejestracja | Tylko niezalogowani |
| `/quizzes/:id` | Szczegóły quizu + komentarze | Publiczny |
| `/quizzes/:id/solve` | Rozwiązywanie quizu | Publiczny |
| `/quizzes/:id/result` | Wyniki | Publiczny (wymaga state z solve) |
| `/quizzes/create` | Kreator nowego quizu | Zalogowany |
| `/quizzes/:id/edit` | Edycja quizu | Zalogowany (autor lub ADMIN) |
| `/my-quizzes` | Moje quizy (szkice + opublikowane) | Zalogowany |

---

## Typy quizów i obsługiwane typy pytań

| Quiz | Typ pytania | Interakcja podczas rozwiązywania |
|---|---|---|
| Test wiedzy | Standard, MultiWybór, Prawda/Fałsz | Radio, Checkbox, Radio |
| Quiz osobowości | Osobowości | Radio — opcja zbiera głos na wynik |
| Dopasowanie | Dopasowanie | Select per para (lewy → prawy) |
| Uzupełnianie luk | UzupełnianieLuk | TextField w miejscu `___` |
| Ranking | ElementRankingu | Drag-and-drop do tierlisty + eksport PNG |

---

## Autentykacja

JWT jest przechowywany przez backend jako **httpOnly cookie** — frontend nigdy nie widzi tokena. Axios używa `withCredentials: true`, więc cookie jest wysyłane automatycznie z każdym żądaniem. Interceptor 401 czyści stan Redux i przekierowuje na `/login`.

---

## Uwagi — wymagane endpointy backendu

Poniższe endpointy backendu muszą być zaimplementowane zanim pełna funkcjonalność frontendu będzie działać:

- `GET /api/quizzes/{id}/questions` — pobieranie pytań do quizu (wymagane do solve i kreatora)
- `POST /api/quizzes/{id}/questions` — dodawanie pytań (wymagane do kreatora)
- `PUT /api/quizzes/{id}/questions/{qid}` — edycja pytania (wymagane do zmiany kolejności)
- `DELETE /api/quizzes/{id}/questions/{qid}` — usuwanie pytania (wymagane do kreatora)

Schematy DTO dla pytań muszą zwracać pola specyficzne dla każdego podtypu (np. `opcje` dla `Standard`, `lewaKolumna`/`prawaKolumna` dla `Dopasowanie`).

---

## Tech Stack

| Biblioteka | Wersja | Rola |
|---|---|---|
| React | 18 | UI |
| TypeScript | 5 | Typowanie |
| Vite | 5 | Bundler / dev server |
| Material UI | 6 | Komponenty UI |
| React Router | 6 | Routing SPA |
| Redux Toolkit | 2 | Stan globalny (auth) |
| TanStack Query | 5 | Fetching, cache, refetch |
| React Hook Form | 7 | Formularze |
| axios | 1.7 | HTTP client |
| html2canvas | 1.4 | Eksport tierlisty do PNG |
