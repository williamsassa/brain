import { create } from 'zustand';
import { ChatMessage, ChatStreamEvent } from '@/types';

interface ChatStoreState {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
  consultationId?: string;

  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  setConsultationId: (id: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  messages: [],
  isLoading: false,
  consultationId: undefined,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  updateLastMessage: (content) => set((state) => {
    const messages = [...state.messages];
    if (messages.length > 0) {
      messages[messages.length - 1] = {
        ...messages[messages.length - 1],
        content,
      };
    }
    return { messages };
  }),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setConsultationId: (id) => set({ consultationId: id }),
  clearMessages: () => set({ messages: [], error: undefined }),
}));
