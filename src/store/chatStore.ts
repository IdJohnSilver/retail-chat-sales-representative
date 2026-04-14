import { create } from 'zustand';
import type { Chat, Message } from '../types';
import { fetchChats, fetchMessages } from '../api/chatsApi';

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  messagesLoading: boolean;
  messagesError: string | null;
  setActiveChat: (chatId: string | null) => void;
  setChats: (chats: Chat[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  loading: false,
  error: null,
  messagesLoading: false,
  messagesError: null,
  setActiveChat: (chatId) => {
    set({ activeChatId: chatId, messages: [], messagesError: null });
  },
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
  loadMessages: async (chatCode) => {
    set({ messagesLoading: true, messagesError: null, messages: [] });
    try {
      const messages = await fetchMessages(chatCode);
      set({ messages });
    } catch {
      set({ messagesError: 'Не удалось загрузить сообщения' });
    } finally {
      set({ messagesLoading: false });
    }
  },
}));
