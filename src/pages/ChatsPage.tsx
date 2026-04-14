import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { useChatStore } from '../store/chatStore';

export function ChatsPage() {
  const activeChatId = useChatStore((s) => s.activeChatId);

  return (
    <div className="chats-page">
      <aside className="chats-sidebar">
        <ChatList />
      </aside>
      <section className="chats-content">
        {activeChatId ? (
          <ChatWindow />
        ) : (
          <div className="chats-placeholder">Выберите чат</div>
        )}
      </section>
    </div>
  );
}
