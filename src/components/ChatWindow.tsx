import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { formatMessageDate } from '../utils/formatMessageDate';

export function ChatWindow() {
  const messages = useChatStore((s) => s.messages);
  const messagesLoading = useChatStore((s) => s.messagesLoading);
  const messagesError = useChatStore((s) => s.messagesError);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    // TODO: отправка сообщения через API
    setInput('');
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messagesLoading && (
          <div className="chat-messages-empty">Загрузка...</div>
        )}
        {messagesError && (
          <div className="chat-messages-empty chat-messages-error">{messagesError}</div>
        )}
        {!messagesLoading && !messagesError && sortedMessages.map((msg) => (
          <div key={msg.code} className="chat-message">
            <span className="chat-message-author">{msg.userName}</span>
            <p className="chat-message-text">{msg.text}</p>
            <time className="chat-message-time">{formatMessageDate(msg.createdAt)}</time>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Введите сообщение..."
        />
        <button onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
}
