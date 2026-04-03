import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, label, ...props }, ref) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'w-4 h-4 rounded border border-white/[0.12] bg-[#060d19] accent-[#00D4FF] cursor-pointer',
          className
        )}
        {...props}
      />
      {label && <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
export { Checkbox };
