import { httpClient } from './httpClient';
import type { Chat, Message } from '../types';

export function fetchChats(): Promise<Chat[]> {
  return httpClient.get<Chat[]>('chats');
}

export function fetchMessages(chatCode: string): Promise<Message[]> {
  return httpClient.get<Message[]>(`chats/${chatCode}/messages`);
}
