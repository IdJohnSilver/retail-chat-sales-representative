import { create } from 'zustand';
import type { Chat, Message } from '../types';
import { fetchChats, fetchMessages, sendMessage as sendMessageApi } from '../api/chatsApi';

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  activeChatCode: string | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  messagesLoading: boolean;
  messagesError: string | null;
  sending: boolean;
  sendError: string | null;
  setActiveChat: (chatId: string | null, chatCode?: string | null) => void;
  setChats: (chats: Chat[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  loadChats: () => Promise<void>;
  loadMessages: (chatCode: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,
  activeChatCode: null,
  messages: [],
  loading: false,
  error: null,
  messagesLoading: false,
  messagesError: null,
  sending: false,
  sendError: null,
  setActiveChat: (chatId, chatCode = null) => {
    set({ activeChatId: chatId, activeChatCode: chatCode, messages: [], messagesError: null });
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
  sendMessage: async (text) => {
    const { activeChatCode } = get();
    if (!activeChatCode) return;
    set({ sending: true, sendError: null });
    try {
      const message = await sendMessageApi(activeChatCode, text);
      set((state) => ({ messages: [...state.messages, message] }));
    } catch {
      set({ sendError: 'Не удалось отправить сообщение' });
    } finally {
      set({ sending: false });
    }
  },
}));
