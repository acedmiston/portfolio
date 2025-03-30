import { links } from './data';

export type SectionName = (typeof links)[number]['nameKey'];

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp?: number;
}
