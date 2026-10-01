import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, max = 100, className, color, showLabel, size = 'md' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', color || 'bg-blue-500')}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-gray-500 mt-1 block">{pct}%</span>}
    </div>
  );
}

interface MasteryBadgeProps {
  score: number;
  status?: string;
}

export function MasteryBadge({ score, status }: MasteryBadgeProps) {
  const color =
    score >= 90 ? 'bg-green-100 text-green-700 border-green-300'
    : score >= 75 ? 'bg-blue-100 text-blue-700 border-blue-300'
    : score >= 60 ? 'bg-amber-100 text-amber-700 border-amber-300'
    : score >= 40 ? 'bg-orange-100 text-orange-700 border-orange-300'
    : 'bg-red-100 text-red-700 border-red-300';
  const label = status || (score >= 90 ? 'Mastered' : score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : score >= 40 ? 'Weak' : 'Critical');
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', color)}>
      {label} ({score}%)
    </span>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm',
        hoverable && 'hover:shadow-md hover:border-gray-300 transition-all cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  sublabel?: string;
}

export function StatCard({ label, value, icon, color = 'text-blue-600', sublabel }: StatCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">{label}</p>
          <p className={cn('text-xl sm:text-2xl font-bold mt-1', color)}>{value}</p>
          {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
        </div>
        {icon && <div className={cn('opacity-80', color)}>{icon}</div>}
      </div>
    </Card>
  );
}

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ message, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="text-gray-300 mb-3">{icon}</div>}
      <p className="text-gray-500 text-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color }: BadgeProps) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    gray: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', colors[color || 'gray'])}>
      {label}
    </span>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({ children, onClick, variant = 'primary', size = 'md', className, disabled, type = 'button' }: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}
