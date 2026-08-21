import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const variants: Record<Variant, string> = {
  default: 'bg-slate-100 text-slate-700 ring-slate-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  neutral: 'bg-slate-800 text-slate-100 ring-slate-700',
};

export function Badge({
  children,
  variant = 'default',
  className,
  dot,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        variants[variant],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400 shadow-sm',
    secondary: 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:ring-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400 shadow-sm',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-400 shadow-sm',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-300 shadow-sm',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </button>
  );
}

export function Progress({
  value,
  variant = 'primary',
  className,
}: {
  value: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}) {
  const colors = {
    primary: 'bg-slate-900',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-indigo-500',
  };
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700 ease-out', colors[variant])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: Variant; label: string }> = {
    FastTrackApproved: { variant: 'success', label: 'Fast-Track Approved' },
    HighRiskFlagged: { variant: 'danger', label: 'High-Risk Flagged' },
    TenancyVerificationRequired: { variant: 'warning', label: 'Tenancy Verification Required' },
    PendingReview: { variant: 'info', label: 'Pending Review' },
    Approved: { variant: 'success', label: 'Approved' },
    Rejected: { variant: 'danger', label: 'Rejected' },
    TenancyProofRequested: { variant: 'warning', label: 'Tenancy Proof Requested' },
    Disbursed: { variant: 'success', label: 'Disbursed' },
  };
  const cfg = map[status] ?? { variant: 'neutral' as Variant, label: status };
  return (
    <Badge variant={cfg.variant} dot>
      {cfg.label}
    </Badge>
  );
}
