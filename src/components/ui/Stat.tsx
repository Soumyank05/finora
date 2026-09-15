import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatProps {
  label: string;
  value: string;
  subtext?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  subtext,
  change,
  changeLabel,
  icon,
  className
}) => {
  const isPositive = change !== undefined ? change >= 0 : true;

  return (
    <div className={cn('p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs space-y-2', className)}>
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>

      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight tabular-nums">
        {value}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        {subtext && <span>{subtext}</span>}
        {change !== undefined && (
          <span className={cn('flex items-center gap-0.5 font-semibold tabular-nums', isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400')}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {isPositive ? '+' : ''}{change.toFixed(1)}% {changeLabel}
          </span>
        )}
      </div>
    </div>
  );
};
