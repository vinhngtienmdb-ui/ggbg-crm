'use client';

import React from 'react';
import { clsx } from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 border border-indigo-600 hover:border-indigo-700',
  secondary:
    'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700',
  ghost:
    'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent',
  danger:
    'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white border border-red-500 hover:border-red-600 shadow-sm shadow-red-200 dark:shadow-red-900/30',
  success:
    'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white border border-emerald-600 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30',
  outline:
    'bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-[11px] gap-1 rounded-md',
  sm: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-3.5 py-2 text-sm gap-2 rounded-lg',
  lg: 'px-5 py-2.5 text-base gap-2.5 rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 select-none',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        !isDisabled && 'active:translate-y-px',
        className
      )}
    >
      {loading ? (
        <svg
          className="animate-spin w-3.5 h-3.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
