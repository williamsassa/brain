'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, ThumbsUp, ThumbsDown, User, Brain, Check, Sparkles } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isSystem = message.messageType === 'system';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <motion.div
        className="flex justify-end gap-2.5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-[80%]">
          {isSystem && (
            <div className="text-[9px] text-[#00D4FF]/40 mb-1 text-right flex items-center justify-end gap-1">
              <Sparkles size={8} />
              <span>Auto-analysis</span>
            </div>
          )}
          <div className="px-3.5 py-2.5 rounded-2xl rounded-br-sm bg-[#00D4FF]/[0.08] border border-[#00D4FF]/[0.12]">
            <p className="text-[13px] leading-relaxed text-white/80 whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mt-auto">
          <User size={12} className="text-white/30" />
        </div>
      </motion.div>
    );
  }

  // Assistant message
  return (
    <motion.div
      className="flex gap-2.5 group"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF]/10 to-[#00D4FF]/5 border border-[#00D4FF]/10 flex items-center justify-center mt-1">
        <Brain size={12} className="text-[#00D4FF]/70" />
      </div>
      <div className="max-w-[88%] min-w-0">
        <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white/[0.03] border border-white/[0.06]">
          <div className="prose prose-sm prose-invert max-w-none
            prose-p:text-white/70 prose-p:text-[13px] prose-p:leading-relaxed prose-p:my-1.5
            prose-headings:text-[#00D4FF]/90 prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1.5
            prose-h1:text-sm prose-h2:text-[13px] prose-h3:text-[13px]
            prose-strong:text-[#00D4FF]/80 prose-strong:font-semibold
            prose-em:text-white/50
            prose-code:text-[#00E5A0]/80 prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:border prose-code:border-white/[0.06]
            prose-pre:bg-[#060d19] prose-pre:border prose-pre:border-white/[0.06] prose-pre:rounded-xl prose-pre:p-3
            prose-ul:my-1.5 prose-ol:my-1.5 prose-li:text-[13px] prose-li:text-white/70 prose-li:my-0.5
            prose-a:text-[#00D4FF]/80 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-[#00D4FF]/30
            prose-blockquote:border-l-[#00D4FF]/30 prose-blockquote:text-white/50 prose-blockquote:bg-white/[0.02] prose-blockquote:px-3 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
            prose-hr:border-white/[0.06]
            prose-table:text-[13px] prose-th:text-[#00D4FF]/70 prose-th:border-white/[0.08] prose-td:border-white/[0.06]
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Hover action bar */}
        <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={copyToClipboard}
            className="p-1 rounded-md text-white/15 hover:text-[#00D4FF]/60 hover:bg-white/[0.03] transition-all"
            title="Copy"
          >
            {copied ? <Check size={12} className="text-[#00E5A0]/80" /> : <Copy size={12} />}
          </button>
          <button className="p-1 rounded-md text-white/15 hover:text-[#00E5A0]/60 hover:bg-white/[0.03] transition-all" title="Helpful">
            <ThumbsUp size={12} />
          </button>
          <button className="p-1 rounded-md text-white/15 hover:text-[#FF4757]/60 hover:bg-white/[0.03] transition-all" title="Not helpful">
            <ThumbsDown size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const MemoizedBubble = memo(MessageBubble);

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MemoizedBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
