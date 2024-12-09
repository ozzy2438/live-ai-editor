export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  language: 'en' | 'tr';
}