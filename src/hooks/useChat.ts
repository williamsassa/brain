import { useCallback, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { usePatientStore } from '@/store/patientStore';
import { useLanguage } from '@/hooks/useLanguage';
import { ChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export const useChat = () => {
  const { messages, isLoading, setLoading, addMessage, updateLastMessage, clearMessages, setError } = useChatStore();
  const { doctor } = useAuthStore();
  const { currentPatient } = usePatientStore();
  const { language } = useLanguage();
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, isAutoAnalysis: boolean = false) => {
      if (!content.trim() || !doctor) return;

      // Abort any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        messageType: isAutoAnalysis ? 'system' : 'text',
        createdAt: new Date(),
        timestamp: Date.now(),
      };

      addMessage(userMessage);
      setLoading(true);
      setError(undefined);

      try {
        // Build message history for context (last 20 messages)
        const recentMessages = [...messages.slice(-20), userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Build patient data context
        const patientData = currentPatient ? {
          identity: currentPatient.identity,
          vitals: currentPatient.vitals,
          medicalHistory: currentPatient.medicalHistory,
          chiefComplaint: currentPatient.chiefComplaint,
          symptoms: currentPatient.additionalSymptoms,
          painScale: currentPatient.painScale,
          specialtyData: currentPatient.specialtyData,
        } : undefined;

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: recentMessages,
            patientData,
            specialty: doctor.specialty,
            language,
            isAutoAnalysis,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';

        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: '',
          messageType: 'text',
          createdAt: new Date(),
          timestamp: Date.now(),
        };

        addMessage(assistantMessage);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;
          updateLastMessage(assistantContent);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Chat error:', error);
        setError(error.message || 'Failed to get AI response');

        // Add error message
        addMessage({
          id: uuidv4(),
          role: 'assistant',
          content: `⚠️ Error: ${error.message || 'Failed to get AI response. Please try again.'}`,
          messageType: 'text',
          createdAt: new Date(),
          timestamp: Date.now(),
        });
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, doctor, currentPatient, language, addMessage, updateLastMessage, setLoading, setError]
  );

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  }, [setLoading]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    stopGeneration,
  };
};
