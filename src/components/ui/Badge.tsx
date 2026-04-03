import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#00D4FF]/[0.08] text-[#00D4FF]/80 border-[#00D4FF]/15',
    success: 'bg-[#00E5A0]/[0.08] text-[#00E5A0]/80 border-[#00E5A0]/15',
    warning: 'bg-[#FFB347]/[0.08] text-[#FFB347]/80 border-[#FFB347]/15',
    danger: 'bg-[#FF4757]/[0.08] text-[#FF4757]/80 border-[#FF4757]/15',
    info: 'bg-[#5352ED]/[0.08] text-[#5352ED]/80 border-[#5352ED]/15',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
