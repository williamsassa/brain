'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { useAuthStore } from '@/store/authStore';
import { useLanguage } from '@/hooks/useLanguage';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import { Brain, Sparkles, StopCircle, Trash2, Zap } from 'lucide-react';

export default function ChatContainer() {
  const { messages, isLoading, sendMessage, clearMessages, stopGeneration } = useChat();
  const { doctor } = useAuthStore();
  const { language } = useLanguage();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !doctor) return;
    await sendMessage(text, false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#080e1a]">
      {/* Chat Header */}
      <div className="flex-shrink-0 px-4 py-2.5 border-b border-white/[0.06] bg-[#0a1020]/80 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF]/15 to-[#00D4FF]/5 border border-[#00D4FF]/10 flex items-center justify-center">
                <Brain size={16} className="text-[#00D4FF]" />
              </div>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00E5A0] rounded-full border-2 border-[#0a1020]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white/80">HELIX-FT Medical AI</h2>
              <div className="flex items-center gap-1">
                <Zap size={8} className="text-[#00E5A0]" />
                <span className="text-[9px] text-white/30 font-medium">{doctor?.specialty} specialist</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <motion.button
                onClick={clearMessages}
                className="p-1.5 rounded-lg text-white/20 hover:text-[#FF4757]/80 hover:bg-[#FF4757]/[0.06] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Clear conversation"
              >
                <Trash2 size={13} />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-sm"
            >
              {/* Animated icon */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00D4FF]/10 to-[#00D4FF]/5 border border-[#00D4FF]/10"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain size={28} className="text-[#00D4FF]/60" />
                </div>
              </div>
              <h3 className="text-sm font-semibold mb-1.5 text-white/70">
                {language === 'en' ? 'Medical AI Assistant Ready' : 'Assistant IA Medical Pret'}
              </h3>
              <p className="text-xs text-white/30 mb-6 leading-relaxed">
                {language === 'en'
                  ? 'Fill in patient information on the left. The AI will auto-analyze data as you enter it.'
                  : 'Remplissez les informations patient a gauche. L\'IA analysera automatiquement les donnees.'}
              </p>
              <QuickActions onSelectAction={handleSendMessage} />
            </motion.div>
          </div>
        ) : (
          <div className="px-4 py-4">
            <MessageList messages={messages} />
          </div>
        )}
      </div>

      {/* Stop Generation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-center px-4 py-2"
          >
            <motion.button
              onClick={stopGeneration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <StopCircle size={12} />
              Stop generating
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions when messages exist */}
      {messages.length > 0 && !isLoading && (
        <div className="px-4 py-1.5 border-t border-white/[0.04]">
          <QuickActions onSelectAction={handleSendMessage} compact />
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 p-3 border-t border-white/[0.06] bg-[#0a1020]/60 backdrop-blur-xl">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder={language === 'en' ? 'Ask about patient diagnosis, drug interactions...' : 'Posez des questions sur le diagnostic, interactions medicamenteuses...'}
        />
      </div>
    </div>
  );
}
