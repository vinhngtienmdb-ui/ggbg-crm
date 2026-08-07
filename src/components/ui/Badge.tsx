import React from 'react';
import { clsx } from 'clsx';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'outline';

export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  primary:  'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
  success:  'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
  warning:  'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
  danger:   'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300',
  info:     'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300',
  purple:   'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
  outline:  'bg-transparent border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400',
};

const dotColors: Record<BadgeVariant, string> = {
  default:  'bg-slate-500',
  primary:  'bg-indigo-500',
  success:  'bg-emerald-500',
  warning:  'bg-amber-500',
  danger:   'bg-red-500',
  info:     'bg-cyan-500',
  purple:   'bg-purple-500',
  outline:  'bg-slate-400',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px] gap-1 rounded',
  md: 'px-2 py-0.5 text-xs gap-1.5 rounded-md',
};

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span className={clsx('rounded-full shrink-0', dotColors[variant], size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5')} />
      )}
      {children}
    </span>
  );
}
