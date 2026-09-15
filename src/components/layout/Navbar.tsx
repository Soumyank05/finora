import React from 'react';
import { useWealth } from '../../context/WealthContext';
import { formatINR } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { 
  PieChart, 
  Target, 
  User, 
  Plus, 
  TrendingUp,
  Sun,
  Moon
} from 'lucide-react';

interface NavItem {
  id: 'portfolio' | 'advisor' | 'goals' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Navbar: React.FC = () => {
  const { 
    user, 
    summary, 
    activeTab, 
    setActiveTab, 
    setIsAddHoldingOpen, 
    theme, 
    toggleTheme 
  } = useWealth();

  const navItems: NavItem[] = [
    { id: 'portfolio', label: 'Portfolio Ledger', icon: PieChart },
    { id: 'advisor', label: 'Advisory & Tax', icon: TrendingUp },
    { id: 'goals', label: 'Life Milestones & FIRE', icon: Target },
    { id: 'profile', label: 'Demographics & Slabs', icon: User }
  ];

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs transition-colors duration-150">
      {/* Brand & User identity */}
      <div className="flex items-center gap-4">
        {/* Finora Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <img 
            src="/finora-logo.png" 
            alt="Finora" 
            className="w-8 h-8 rounded-lg object-cover shadow-xs border border-slate-200/90 dark:border-slate-700/90 shrink-0" 
          />
          <span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">
            Finora
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* User profile & net worth */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[11px] border border-slate-200 dark:border-slate-700">
            {userInitials}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                {user.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {user.city.split(',')[0]}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Net Worth: <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{formatINR(summary.netWorth, { compact: true })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="flex items-center bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-1 gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200/80 dark:border-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 pr-3">
          <span>Unrealized Gain:</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
            +{formatINR(summary.totalGain, { compact: true })} (+{summary.totalGainPercent.toFixed(1)}%)
          </span>
        </div>

        {/* Theme Mode Switcher (Dark / Light) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-150 shadow-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 cursor-pointer"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddHoldingOpen(true)}
          className="gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </Button>
      </div>
    </header>
  );
};
