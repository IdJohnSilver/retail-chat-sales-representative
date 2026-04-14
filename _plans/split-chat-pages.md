# План реализации: Split Chat Pages

Основан на спецификации: [_specs/split-chat-pages.md](../_specs/split-chat-pages.md)

---

## Шаг 1. Компонент кнопки «Назад» и обновлённая шапка

**Цель:** вынести в шапку единую кнопку «Назад», работающую по браузерной истории.

- Создать компонент `src/components/BackButton.tsx`:
  - Использует хук `useNavigate` из `react-router-dom`
  - По клику вызывает `navigate(-1)`
  - Если браузерная история пуста (например, прямой заход по ссылке), выполняет `navigate('/chats', { replace: true })`
  - Для определения наличия истории использовать `window.history.state?.idx` или `location.key !== 'default'`
- Обновить `src/layouts/MainLayout.tsx`:
  - Разместить `BackButton` в `header` слева от заголовка
  - Кнопка отображается на всех страницах под `MainLayout` (список и чат). Если потребуется скрывать её на других страницах в будущем — это вне скоупа.

**Файлы:**
- `src/components/BackButton.tsx` (новый)
- `src/layouts/MainLayout.tsx` (изменение)

---

## Шаг 2. Выделить страницу списка чатов `/chats`

**Цель:** превратить текущую `ChatsPage` в страницу только списка, без окна сообщений.

- Переписать `src/pages/ChatsPage.tsx`:
  - Удалить рендер `ChatWindow` и placeholder «Выберите чат»
  - Оставить только `ChatList` и вызов `loadChats` в `useEffect`
- Обновить `src/components/ChatList.tsx`:
  - Заменить вызов `setActiveChat` и `loadMessages` внутри `onClick` на `navigate(`/chat/${chat.chaCode}`)` через `useNavigate`
  - Удалить подсветку активного чата по `activeChatId` (в отдельной странице списка она неактуальна)

**Файлы:**
- `src/pages/ChatsPage.tsx` (изменение)
- `src/components/ChatList.tsx` (изменение)

---

## Шаг 3. Новая страница просмотра сообщений `/chat/:code`

**Цель:** отдельная страница, получающая `chaCode` из URL и отображающая `ChatWindow`.

- Создать `src/pages/ChatPage.tsx`:
  - Получает параметр `code` через `useParams<{ code: string }>()`
  - В `useEffect` на изменение `code`:
    - Вызывает `setActiveChat(null, code)` (или новый метод, см. Шаг 4), чтобы синхронизировать `activeChatCode` со store
    - Вызывает `loadMessages(code)`
  - Рендерит `<ChatWindow />`
  - При отсутствии `code` (на случай некорректного URL) выполняет редирект на `/chats` через `<Navigate to="/chats" replace />`

**Файлы:**
- `src/pages/ChatPage.tsx` (новый)

---

## Шаг 4. Синхронизация `chatStore` с маршрутом

**Цель:** упростить установку активного чата по `chaCode` из URL.

- В `src/store/chatStore.ts`:
  - Добавить метод `setActiveChatByCode(chatCode: string)`:
    - Ищет чат по `chaCode` в `chats` (если уже загружен) и устанавливает `activeChatId` + `activeChatCode`
    - Если список чатов ещё пуст — устанавливает только `activeChatCode` (чтобы `sendMessage` работал), `activeChatId` останется `null` до загрузки списка
  - Альтернативно — расширить `setActiveChat` так, чтобы корректно обрабатывать случай, когда известен только `chatCode`
- Использовать этот метод в `ChatPage` вместо ручного `setActiveChat(null, code)`

**Файлы:**
- `src/store/chatStore.ts` (изменение)
- `src/pages/ChatPage.tsx` (использовать новый метод)

---

## Шаг 5. Обновить роутинг

**Цель:** подключить новые страницы и сделать `/chats` маршрутом по умолчанию.

- Обновить `src/router.tsx`:
  - Удалить маршрут `path: '/'` с `ChatsPage`
  - Добавить маршруты внутри `MainLayout`:
    - `path: '/chats'` → `<ChatsPage />`
    - `path: '/chat/:code'` → `<ChatPage />`
    - `path: '/'` → `<Navigate to="/chats" replace />` (редирект по умолчанию)
  - Опционально: `path: '*'` внутри защищённой зоны — редирект на `/chats`

**Файлы:**
- `src/router.tsx` (изменение)

---

## Шаг 6. Проверка и минимальные стили

**Цель:** убедиться, что переходы и кнопка «Назад» работают, и докрутить стили.

- Проверить сценарии вручную:
  - `/chats` → клик по чату → `/chat/:code` → сообщения загружаются
  - Кнопка «Назад» на `/chat/:code` возвращает на `/chats`
  - Прямой вход по ссылке `/chat/:code` корректно загружает сообщения и кнопка «Назад» ведёт на `/chats`
  - Отправка сообщения всё ещё работает (`sendMessage` использует `activeChatCode`)
- При необходимости добавить/подкорректировать стили шапки под кнопку «Назад» (в существующих css-классах `app-header`)

**Файлы:**
- css-файлы проекта (по необходимости)

---

## Порядок выполнения

```
Шаг 1 → Шаг 2 → Шаг 4 → Шаг 3 → Шаг 5 → Шаг 6
```

---

## Новые файлы

- `src/components/BackButton.tsx`
- `src/pages/ChatPage.tsx`

## Изменяемые файлы

| Файл | Что меняется |
|---|---|
| `src/layouts/MainLayout.tsx` | Добавлена кнопка «Назад» в шапку |
| `src/pages/ChatsPage.tsx` | Удалён `ChatWindow` и placeholder, остаётся только список |
| `src/components/ChatList.tsx` | Клик переводит на `/chat/:code` через `useNavigate` вместо локального выбора |
| `src/store/chatStore.ts` | Добавлен метод `setActiveChatByCode` для синхронизации активного чата с URL |
| `src/router.tsx` | Новые маршруты `/chats` и `/chat/:code`, редирект с `/` на `/chats` |

## Зависимости

Новые npm-пакеты не требуются — `react-router-dom` уже используется в проекте.
