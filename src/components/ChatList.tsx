import { useChatStore } from '../store/chatStore';

export function ChatList() {
  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const setActiveChat = useChatStore((s) => s.setActiveChat);

  return (
    <ul className="chat-list">
      {chats.map((chat) => (
        <li
          key={chat.id}
          className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`}
          onClick={() => setActiveChat(chat.id)}
        >
          <span className="chat-list-item-name">
            Торговая точка #{chat.tradePointId}
          </span>
          {chat.lastMessage && (
            <span className="chat-list-item-preview">
              {chat.lastMessage.text}
            </span>
          )}
        </li>
      ))}
      {chats.length === 0 && (
        <li className="chat-list-empty">Нет доступных чатов</li>
      )}
    </ul>
  );
}
