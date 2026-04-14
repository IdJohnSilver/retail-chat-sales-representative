import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ChatWindow } from '../components/ChatWindow';
import { useChatStore } from '../store/chatStore';

export function ChatPage() {
  const { code } = useParams<{ code: string }>();
  const setActiveChatByCode = useChatStore((s) => s.setActiveChatByCode);
  const loadMessages = useChatStore((s) => s.loadMessages);

  useEffect(() => {
    if (!code) return;
    setActiveChatByCode(code);
    loadMessages(code);
  }, [code, setActiveChatByCode, loadMessages]);

  if (!code) {
    return <Navigate to="/chats" replace />;
  }

  return (
    <div className="chat-page">
      <ChatWindow />
    </div>
  );
}
