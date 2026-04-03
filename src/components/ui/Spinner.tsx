export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-white/[0.06] border-t-[#00D4FF] w-6 h-6 ${className}`} />
  );
}
