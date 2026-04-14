# План реализации: Chat Messages

Основан на спецификации: [_specs/chat-messages.md](../_specs/chat-messages.md)

---

## Шаг 1. Обновить тип Message

**Цель:** привести тип `Message` к формату ответа API.

- Текущий тип содержит поля `id`, `chatId`, `senderId`, `status`, которые не соответствуют формату API
- Обновить интерфейс `Message` в `src/types/index.ts`:
  - `code: string` — идентификатор сообщения
  - `text: string` — текст сообщения
  - `createdAt: string` — дата создания в ISO-формате
  - `userCode: string` — код автора
  - `userName: string` — имя автора

**Файлы:**
- `src/types/index.ts` (изменение)

---

## Шаг 2. API-функция получения сообщений

**Цель:** реализовать вызов `GET chats/{chatId}/messages` через httpClient.

- Добавить в `src/api/chatsApi.ts` функцию `fetchMessages(chatId: string)`
- Функция отправляет `GET` на `chats/${chatId}/messages` через `httpClient`
- Возвращает массив объектов `Message`

**Файлы:**
- `src/api/chatsApi.ts` (изменение)

---

## Шаг 3. Обновить chatStore

**Цель:** добавить загрузку сообщений при выборе чата.

- Добавить состояния: `messagesLoading: boolean`, `messagesError: string | null`
- Добавить действие `loadMessages(chatId: string)`:
  - Устанавливает `messagesLoading: true`, `messagesError: null`, очищает `messages`
  - Вызывает `fetchMessages(chatId)`
  - Сохраняет результат в `messages`
  - При ошибке сохраняет сообщение в `messagesError`
- Обновить `setActiveChat`: при смене активного чата вызывать `loadMessages`

**Файлы:**
- `src/store/chatStore.ts` (изменение)

---

## Шаг 4. Утилита форматирования даты

**Цель:** реализовать логику форматирования даты сообщения.

- Создать `src/utils/formatMessageDate.ts`
- Функция `formatMessageDate(isoDate: string): string`:
  - Если дата — сегодня: вернуть `HH:mm`
  - Иначе: вернуть `DD.MM.YYYY HH:mm`
- Реализовать без внешних библиотек (через `Date` и ручное форматирование)

**Файлы:**
- `src/utils/formatMessageDate.ts` (новый)

---

## Шаг 5. Обновить ChatWindow

**Цель:** отобразить сообщения с данными из API.

- Подписаться на `messages`, `messagesLoading`, `messagesError` из `chatStore`
- При `messagesLoading` — отображать индикатор загрузки
- При `messagesError` — отображать сообщение об ошибке
- Отрисовать список сообщений в хронологическом порядке (сортировка по `createdAt`)
- Каждый элемент содержит:
  - Имя автора (`userName`)
  - Текст сообщения (`text`)
  - Форматированную дату (через `formatMessageDate`)
- Использовать `code` как ключ элемента

**Файлы:**
- `src/components/ChatWindow.tsx` (изменение)

---

## Порядок выполнения

```
Шаг 1 → Шаг 2 → Шаг 3 → Шаг 4 → Шаг 5
```

---

## Новые файлы

| Файл | Назначение |
|---|---|
| `src/utils/formatMessageDate.ts` | Форматирование даты сообщения |

## Изменяемые файлы

| Файл | Что меняется |
|---|---|
| `src/types/index.ts` | Тип `Message` приведён к формату API |
| `src/api/chatsApi.ts` | Добавлена функция `fetchMessages()` |
| `src/store/chatStore.ts` | `messagesLoading`, `messagesError`, `loadMessages()`, обновлён `setActiveChat` |
| `src/components/ChatWindow.tsx` | Рендеринг сообщений с автором, текстом и датой; состояния загрузки/ошибки |

## Зависимости

Новые npm-пакеты не требуются.
