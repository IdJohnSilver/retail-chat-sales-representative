# План реализации: Send Message

Основан на спецификации: [_specs/send-message.md](../_specs/send-message.md)

---

## Шаг 1. Сохранять activeChatCode в store

**Цель:** дать компонентам доступ к `chaCode` активного чата для API-вызовов.

- Сейчас store хранит `activeChatId` (это `chaId`), но API сообщений работает по `chatCode` (`chaCode`)
- Добавить в `chatStore` поле `activeChatCode: string | null`
- Обновить `setActiveChat` — принимать и сохранять оба значения (`chatId`, `chatCode`)
- Обновить вызов `setActiveChat` в `ChatList`, чтобы передавать `chatCode`

**Файлы:**
- `src/store/chatStore.ts` (изменение)
- `src/components/ChatList.tsx` (изменение)

---

## Шаг 2. API-функция отправки сообщения

**Цель:** реализовать вызов `POST chats/{chatCode}/messages` через httpClient.

- Добавить в `src/api/chatsApi.ts` функцию `sendMessage(chatCode: string, text: string)`
- Функция отправляет `POST` на `chats/${chatCode}/messages` с payload `{ text }`
- Возвращает объект `Message`

**Файлы:**
- `src/api/chatsApi.ts` (изменение)

---

## Шаг 3. Обновить chatStore

**Цель:** добавить действие отправки сообщения с состоянием загрузки.

- Добавить состояния: `sending: boolean`, `sendError: string | null`
- Добавить действие `sendMessage(text: string)`:
  - Получает `activeChatCode` из state
  - Устанавливает `sending: true`, `sendError: null`
  - Вызывает `sendMessage(chatCode, text)` из API
  - При успехе добавляет полученное сообщение в `messages` через `addMessage`
  - При ошибке сохраняет сообщение в `sendError`
  - Устанавливает `sending: false`

**Файлы:**
- `src/store/chatStore.ts` (изменение)

---

## Шаг 4. Обновить ChatWindow

**Цель:** реализовать `handleSend` с блокировкой UI во время отправки и отображением ошибки.

- Подписаться на `sending`, `sendError` из `chatStore`
- Реализовать `handleSend`: вызывает `sendMessage(text)` из store, при успехе очищает поле ввода
- Во время отправки (`sending === true`) заблокировать поле ввода и кнопку (атрибут `disabled`)
- При ошибке (`sendError`) отобразить уведомление, текст сообщения сохраняется в поле ввода

**Файлы:**
- `src/components/ChatWindow.tsx` (изменение)

---

## Порядок выполнения

```
Шаг 1 → Шаг 2 → Шаг 3 → Шаг 4
```

---

## Новые файлы

Нет.

## Изменяемые файлы

| Файл | Что меняется |
|---|---|
| `src/store/chatStore.ts` | `activeChatCode`, `sending`, `sendError`, `sendMessage()`, обновлён `setActiveChat` |
| `src/api/chatsApi.ts` | Добавлена функция `sendMessage()` |
| `src/components/ChatList.tsx` | Передаёт `chatCode` в `setActiveChat` |
| `src/components/ChatWindow.tsx` | Реализация `handleSend`, блокировка UI при отправке, отображение ошибки |

## Зависимости

Новые npm-пакеты не требуются.
