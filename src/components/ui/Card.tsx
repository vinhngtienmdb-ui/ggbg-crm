import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Top-color accent bar variant */
  accent?: 'primary' | 'success' | 'warning' | 'danger' | 'none';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const accentColors = {
  none: '',
  primary: 'before:bg-indigo-500',
  success: 'before:bg-emerald-500',
  warning: 'before:bg-amber-500',
  danger:  'before:bg-red-500',
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
};

export function Card({ children, className, accent = 'none', hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden',
        accent !== 'none' && [
          'relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-xl',
          accentColors[accent],
        ],
        hover && 'transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/50 cursor-pointer',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, actions }: CardHeaderProps) {
  return (
    <div className={clsx('flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800', className)}>
      <div className="min-w-0 flex-1">{children}</div>
      {actions && <div className="flex items-center gap-2 ml-3 shrink-0">{actions}</div>}
    </div>
  );
}

export function CardBody({ children, className, padding = 'md' }: CardBodyProps) {
  return (
    <div className={clsx(paddingClasses[padding], className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={clsx('px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30', className)}>
      {children}
    </div>
  );
}
