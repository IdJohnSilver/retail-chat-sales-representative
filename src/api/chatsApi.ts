import { httpClient } from './httpClient';
import type { Chat } from '../types';

export function fetchChats(): Promise<Chat[]> {
  return httpClient.get<Chat[]>('chats');
}
