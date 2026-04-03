import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2 bg-[#060d19] border border-white/[0.06] rounded-xl text-white/80 text-sm placeholder-white/20',
        'focus:border-[#00D4FF]/20 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]/10 transition-all',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
export { Input };
