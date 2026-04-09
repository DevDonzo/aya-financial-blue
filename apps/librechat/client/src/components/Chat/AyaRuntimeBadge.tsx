import { cn } from '@librechat/client';
import { useAyaRuntimeStatus } from '~/hooks';

const toneClasses: Record<'neutral' | 'success' | 'warning' | 'danger', string> = {
  neutral: 'border-border-medium bg-surface-chat text-text-secondary',
  success: 'border-emerald-300/70 bg-emerald-500/10 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300',
  warning: 'border-amber-300/70 bg-amber-500/10 text-amber-700 dark:border-amber-700 dark:text-amber-300',
  danger: 'border-rose-300/70 bg-rose-500/10 text-rose-700 dark:border-rose-700 dark:text-rose-300',
};

export default function AyaRuntimeBadge() {
  const status = useAyaRuntimeStatus();

  if (!status.visible) {
    return null;
  }

  return (
    <div
      className={cn(
        'hidden items-center rounded-full border px-3 py-1 text-xs font-medium md:inline-flex',
        toneClasses[status.tone],
      )}
      title={status.detail}
      data-testid="aya-runtime-badge"
      data-state={status.state}
    >
      {status.label}
    </div>
  );
}
