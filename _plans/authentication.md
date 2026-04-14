# План реализации: Authentication

Основан на спецификации: [_specs/authentication.md](../_specs/authentication.md)

---

## Шаг 1. Конфигурация окружения

**Цель:** настроить переменную `BASE_URL` через Vite env.

- Создать файл `.env` в корне проекта с переменной `VITE_BASE_URL`
- Добавить `.env` в `.gitignore` (уже покрыто паттерном `*.local`, но сам `.env` нужно добавить явно)
- Создать файл `.env.example` с примером значения для документации

**Файлы:**
- `.env` (новый)
- `.env.example` (новый)
- `.gitignore` (изменение)

---

## Шаг 2. HTTP-клиент

**Цель:** создать единую точку взаимодействия с API.

- Создать модуль `src/api/httpClient.ts`
- Использовать `fetch` (без дополнительных зависимостей)
- Базовый URL берётся из `import.meta.env.VITE_BASE_URL`
- Клиент предоставляет методы `get`, `post` (и т.д.) с автоматической сериализацией JSON
- Интерцептор: если в localStorage есть `access_token`, добавлять заголовок `Authorization: Bearer <token>`
- При получении ответа `401` — очищать токен и перенаправлять на `/login`

**Файлы:**
- `src/api/httpClient.ts` (новый)

---

## Шаг 3. API-функция логина

**Цель:** реализовать вызов эндпоинта аутентификации.

- Создать `src/api/authApi.ts` с функцией `login(login: string, password: string)`
- Функция отправляет `POST` на `auth/login` через httpClient
- Возвращает `access_token` из ответа

**Файлы:**
- `src/api/authApi.ts` (новый)

---

## Шаг 4. Auth Store (Zustand)

**Цель:** управление состоянием аутентификации.

- Создать `src/store/authStore.ts`
- Состояние: `token: string | null`, `isAuthenticated: boolean`
- Действия: `setToken(token)`, `logout()`
- Инициализация: при создании store читать токен из `localStorage`
- `setToken` — сохраняет токен в `localStorage` и обновляет состояние
- `logout` — удаляет токен из `localStorage`, сбрасывает состояние

**Файлы:**
- `src/store/authStore.ts` (новый)

---

## Шаг 5. Страница логина

**Цель:** UI для ввода логина и пароля.

- Создать `src/pages/LoginPage.tsx`
- Форма с полями `login` и `password`
- Кнопка «Войти»
- Валидация: оба поля обязательны (HTML-атрибут `required`)
- При отправке: вызов `authApi.login()` → сохранение токена через `authStore.setToken()` → редирект на `/`
- При ошибке: отображение сообщения об ошибке под формой
- Стили: добавить в `src/index.css` или создать отдельный CSS-файл

**Файлы:**
- `src/pages/LoginPage.tsx` (новый)
- `src/index.css` (изменение — стили формы логина)

---

## Шаг 6. Защита маршрутов

**Цель:** ограничить доступ неаутентифицированным пользователям.

- Создать компонент `src/components/ProtectedRoute.tsx`
- Логика: если `authStore.isAuthenticated === false` — `<Navigate to="/login" />`
- Иначе — рендерит `<Outlet />`

**Файлы:**
- `src/components/ProtectedRoute.tsx` (новый)

---

## Шаг 7. Обновление маршрутизации

**Цель:** интегрировать логин и защиту маршрутов в роутер.

- Обновить `src/router.tsx`:
  - Добавить маршрут `/login` → `LoginPage`
  - Обернуть существующий `MainLayout` в `ProtectedRoute`
- Структура маршрутов:
  ```
  /login          → LoginPage (публичный)
  /               → ProtectedRoute → MainLayout → ChatsPage
  ```

**Файлы:**
- `src/router.tsx` (изменение)

---

## Шаг 8. Интеграция httpClient с authStore

**Цель:** связать HTTP-клиент с хранилищем токена.

- В `httpClient.ts` импортировать `useAuthStore.getState()` для получения токена и вызова `logout()` при 401
- Убедиться, что клиент корректно работает вне React-компонентов (через `getState()`, а не хук)

**Файлы:**
- `src/api/httpClient.ts` (доработка)

---

## Порядок выполнения

```
Шаг 1 → Шаг 2 → Шаг 3 → Шаг 4 → Шаг 5 → Шаг 6 → Шаг 7 → Шаг 8
```

Шаги выполняются последовательно, каждый следующий зависит от предыдущего.

---

## Новые файлы

| Файл | Назначение |
|---|---|
| `.env` | Переменная `VITE_BASE_URL` |
| `.env.example` | Пример конфигурации |
| `src/api/httpClient.ts` | Единый HTTP-клиент |
| `src/api/authApi.ts` | Функция логина |
| `src/store/authStore.ts` | Zustand store аутентификации |
| `src/pages/LoginPage.tsx` | Страница логина |
| `src/components/ProtectedRoute.tsx` | Защита маршрутов |

## Изменяемые файлы

| Файл | Что меняется |
|---|---|
| `.gitignore` | Добавить `.env` |
| `src/router.tsx` | Новые маршруты, защита |
| `src/index.css` | Стили страницы логина |

## Зависимости

Новые npm-пакеты не требуются. Используются `fetch` (встроенный), `react-router-dom` (уже установлен), `zustand` (уже установлен).
