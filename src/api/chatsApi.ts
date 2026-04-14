import { httpClient } from './httpClient';
import type { Chat, Message } from '../types';

export function fetchChats(): Promise<Chat[]> {
  return httpClient.get<Chat[]>('chats');
}

export function fetchMessages(chatCode: string): Promise<Message[]> {
  return httpClient.get<Message[]>(`chats/${chatCode}/messages`);
}

export function sendMessage(chatCode: string, text: string): Promise<Message> {
  return httpClient.post<Message>(`chats/${chatCode}/messages`, { text });
}
