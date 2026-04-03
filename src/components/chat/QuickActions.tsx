'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { QUICK_ACTIONS } from '@/types/chat';

interface QuickActionsProps {
  onSelectAction: (prompt: string) => void;
  compact?: boolean;
}

export default function QuickActions({ onSelectAction, compact = false }: QuickActionsProps) {
  const { language } = useLanguage();

  const actions = QUICK_ACTIONS.filter(a => a.label !== 'Export PDF');

  if (compact) {
    return (
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {actions.map((action, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSelectAction(language === 'fr' ? action.promptFr : action.prompt)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#162236]/60 border border-[#00D4FF]/8 text-xs text-[#8BA3BE] hover:text-[#00D4FF] hover:border-[#00D4FF]/25 transition-all whitespace-nowrap"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{action.icon}</span>
            <span>{language === 'fr' ? action.labelFr : action.label}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action, idx) => (
        <motion.button
          key={idx}
          onClick={() => onSelectAction(language === 'fr' ? action.promptFr : action.prompt)}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#111D2E] border border-[#1A2A3E] text-left hover:border-[#00D4FF]/25 hover:bg-[#162236]/40 transition-all group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <span className="text-base">{action.icon}</span>
          <span className="text-xs text-[#8BA3BE] group-hover:text-[#E8F4FD] transition-colors">
            {language === 'fr' ? action.labelFr : action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
