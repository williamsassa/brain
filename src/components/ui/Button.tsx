import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-[#00D4FF] to-[#0070A8] text-white shadow-lg shadow-[#00D4FF]/10',
        secondary: 'bg-white/[0.04] text-white/60 border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12]',
        outline: 'border border-white/[0.08] text-white/50 hover:bg-white/[0.04] hover:border-white/[0.12] hover:text-white/70',
        danger: 'bg-[#FF4757]/10 text-[#FF4757]/80 border border-[#FF4757]/15 hover:bg-[#FF4757]/15 hover:text-[#FF4757]',
        ghost: 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]',
      },
      size: {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button, buttonVariants };
