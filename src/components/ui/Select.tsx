import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full px-3 py-2 bg-[#060d19] border border-white/[0.06] rounded-xl text-white/80 text-sm',
        'focus:border-[#00D4FF]/20 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]/10 transition-all',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
export { Select };
