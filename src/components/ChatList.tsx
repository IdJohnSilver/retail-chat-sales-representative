import { useChatStore } from '../store/chatStore';

export function ChatList() {
  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const loadMessages = useChatStore((s) => s.loadMessages);
  const loading = useChatStore((s) => s.loading);
  const error = useChatStore((s) => s.error);

  if (loading) {
    return <div className="chat-list-empty">Загрузка...</div>;
  }

  if (error) {
    return <div className="chat-list-empty chat-list-error">{error}</div>;
  }

  return (
    <ul className="chat-list">
      {chats.map((chat) => (
        <li
          key={chat.chaId}
          className={`chat-list-item ${chat.chaId === activeChatId ? 'active' : ''}`}
          onClick={() => { setActiveChat(chat.chaId, chat.chaCode); loadMessages(chat.chaCode); }}
        >
          <span className="chat-list-item-name">{chat.chaName}</span>
        </li>
      ))}
      {chats.length === 0 && (
        <li className="chat-list-empty">Нет доступных чатов</li>
      )}
    </ul>
  );
}
