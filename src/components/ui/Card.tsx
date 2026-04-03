import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      'bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 transition-all',
      className
    )}>
      {children}
    </div>
  );
}
