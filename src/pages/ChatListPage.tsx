import { useEffect } from 'react';
import { ChatList } from '../components/ChatList';
import { useChatStore } from '../store/chatStore';

export function ChatListPage() {
  const loadChats = useChatStore((s) => s.loadChats);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return (
    <div className="chats-page">
      <ChatList />
    </div>
  );
}
