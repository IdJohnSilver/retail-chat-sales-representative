export interface User {
  id: string;
  name: string;
  role: 'representative' | 'seller';
}

export interface TradePoint {
  id: string;
  name: string;
  address: string;
}

export interface Chat {
  id: string;
  tradePointId: string;
  participants: string[];
  lastMessage?: Message;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}
