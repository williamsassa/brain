'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Paperclip, X, FileText, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // File attachment state
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const message = input.trim();
    if (!message && !attachedFile) return;
    if (disabled) return;

    let finalMessage = message;
    if (attachedFile) {
      finalMessage = message
        ? `[Attached: ${attachedFile.name}]\n\n${message}`
        : `[Attached file: ${attachedFile.name}] Please analyze this document.`;
      removeFile();
    }

    if (finalMessage) {
      onSendMessage(finalMessage);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ==================== AUDIO RECORDING ====================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required for voice input. Please allow microphone access in your browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer token' },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      if (data.text) {
        setInput(prev => prev ? `${prev} ${data.text}` : data.text);
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setInput(prev => prev ? `${prev} [Audio transcription failed]` : '[Audio transcription failed]');
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ==================== FILE ATTACHMENT ====================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB');
      return;
    }

    setAttachedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Recording indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#FF4757]/[0.06] border border-[#FF4757]/[0.12]"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-[#FF4757]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-[11px] text-[#FF4757]/80 font-medium">Recording {formatRecordingTime(recordingTime)}</span>
            <button
              type="button"
              onClick={stopRecording}
              className="ml-auto text-[11px] text-[#FF4757]/60 hover:text-[#FF4757] font-medium transition-colors"
            >
              Stop & Transcribe
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcribing indicator */}
      <AnimatePresence>
        {isTranscribing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00D4FF]/[0.04] border border-[#00D4FF]/[0.1]"
          >
            <Loader2 size={12} className="animate-spin text-[#00D4FF]/60" />
            <span className="text-[11px] text-[#00D4FF]/60">Transcribing audio...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File preview */}
      <AnimatePresence>
        {attachedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]"
          >
            {filePreview ? (
              <img src={filePreview} alt="preview" className="w-9 h-9 rounded-lg object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-[#00D4FF]/[0.06] flex items-center justify-center">
                <FileText size={14} className="text-[#00D4FF]/50" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/60 truncate">{attachedFile.name}</p>
              <p className="text-[9px] text-white/25">{(attachedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 rounded-md text-white/20 hover:text-[#FF4757]/60 transition-colors"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input area */}
      <div className="relative rounded-2xl bg-white/[0.04] border border-white/[0.08] focus-within:border-[#00D4FF]/20 focus-within:bg-white/[0.05] transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? 'Recording...' : placeholder}
          disabled={disabled || isRecording || isTranscribing}
          rows={1}
          className="w-full px-4 py-3 pr-28 bg-transparent text-white/80 text-[13px] placeholder-white/20 focus:outline-none resize-none disabled:opacity-30 disabled:cursor-not-allowed leading-relaxed"
          style={{ minHeight: '44px', maxHeight: '150px' }}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-0.5">
          {/* Mic button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled || isTranscribing}
            className={`p-1.5 rounded-lg transition-all ${
              isRecording
                ? 'text-[#FF4757] bg-[#FF4757]/[0.08]'
                : 'text-white/20 hover:text-white/40 hover:bg-white/[0.04]'
            } disabled:opacity-20`}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
          </button>

          {/* File attachment */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isRecording}
            className="p-1.5 rounded-lg text-white/20 hover:text-white/40 hover:bg-white/[0.04] transition-all disabled:opacity-20"
            title="Attach file"
          >
            <Paperclip size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />

          {/* Send */}
          <motion.button
            type="submit"
            disabled={disabled || (!input.trim() && !attachedFile) || isRecording || isTranscribing}
            className="p-1.5 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0070A8] text-white flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed transition-all ml-0.5"
            whileHover={!disabled && (input.trim() || attachedFile) ? { scale: 1.05 } : {}}
            whileTap={!disabled && (input.trim() || attachedFile) ? { scale: 0.95 } : {}}
          >
            <Send size={14} />
          </motion.button>
        </div>
      </div>
      <p className="text-[9px] text-white/15 text-center mt-1.5">
        Shift+Enter for new line &middot; AI responses require clinical validation
      </p>
    </form>
  );
}
