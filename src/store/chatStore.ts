import { create } from 'zustand';
import type { Chat, Message } from '../types';
import { fetchChats } from '../api/chatsApi';

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  setActiveChat: (chatId: string | null) => void;
  setChats: (chats: Chat[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  loadChats: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  loading: false,
  error: null,
  setActiveChat: (chatId) => set({ activeChatId: chatId }),
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  loadChats: async () => {
    set({ loading: true, error: null });
    try {
      const chats = await fetchChats();
      set({ chats });
    } catch {
      set({ error: 'Не удалось загрузить список чатов' });
    } finally {
      set({ loading: false });
    }
  },
}));
