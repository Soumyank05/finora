import React, { useState, useEffect } from 'react';
import { useWealth } from '../../context/WealthContext';
import { formatINR } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Check, ShieldCheck, User, RotateCcw, Clock } from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { user, updateUser, resetUserToDefault, isSessionModified } = useWealth();

  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city);
  const [age, setAge] = useState(user.age);
  const [retirementAge, setRetirementAge] = useState(user.retirementAge);
  const [monthlyIncome, setMonthlyIncome] = useState(user.monthlyIncome);
  const [monthlyExpenses, setMonthlyExpenses] = useState(user.monthlyExpenses);
  const [taxRegime, setTaxRegime] = useState(user.taxRegime);
  const [riskProfile, setRiskProfile] = useState(user.riskProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Synchronize form values whenever user profile updates or reverts in context
  useEffect(() => {
    setName(user.name);
    setCity(user.city);
    setAge(user.age);
    setRetirementAge(user.retirementAge);
    setMonthlyIncome(user.monthlyIncome);
    setMonthlyExpenses(user.monthlyExpenses);
    setTaxRegime(user.taxRegime);
    setRiskProfile(user.riskProfile);
  }, [user]);

  const calculatedMonthlySurplus = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = Math.round((calculatedMonthlySurplus / (monthlyIncome || 1)) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      city,
      age: Number(age),
      retirementAge: Number(retirementAge),
      monthlyIncome: Number(monthlyIncome),
      monthlyExpenses: Number(monthlyExpenses),
      taxRegime,
      riskProfile
    });

    setSavedSuccess(true);
    setResetSuccess(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    resetUserToDefault();
    setResetSuccess(true);
    setSavedSuccess(false);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          Financial Demographics & Tax Configuration
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          These financial baseline parameters govern statutory tax optimization, retirement models, and risk rebalancing.
        </p>
      </div>

      {/* Session Lifetime Notice */}
      {isSessionModified ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            <span>
              <strong>Session Modifications Active:</strong> Custom parameters remain saved during your active session. When you reopen the page or the session expires, Finora automatically reverts to default data.
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="ml-3 text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:underline shrink-0"
          >
            Reset Defaults
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Default Institutional Baseline Active</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>Session persistence enabled</span>
          </div>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Domicile City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400 shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                min="18"
                max="85"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={e => setRetirementAge(Number(e.target.value))}
                min="35"
                max="75"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400 shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Monthly In-Hand Cashflow (₹)</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Monthly Living Expenses (₹)</label>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={e => setMonthlyExpenses(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400 shadow-2xs"
              />
            </div>
          </div>

          {/* Monthly Cash Flow & Savings Rate Card */}
          <div className="p-4 bg-slate-50/70 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Monthly Cash Flow & Savings Capacity:</span>
              <span className="text-emerald-800 font-semibold tabular-nums">
                {savingsRate}% Net Savings Rate
              </span>
            </div>

            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div 
                className="bg-slate-900 dark:bg-slate-100 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, savingsRate)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-slate-500 block">Monthly Inflow</span>
                <span className="text-slate-900 dark:text-slate-100 font-medium tabular-nums">{formatINR(monthlyIncome)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Operating Costs</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium tabular-nums">{formatINR(monthlyExpenses)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Deployable Capital</span>
                <span className="text-emerald-700 font-semibold tabular-nums">{formatINR(calculatedMonthlySurplus)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Income Tax Filing Framework</label>
              <select
                value={taxRegime}
                onChange={e => setTaxRegime(e.target.value as 'NEW' | 'OLD')}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400 shadow-2xs"
              >
                <option value="NEW">New Tax Regime (₹75k Std Deduction, Budget 2024 Slabs)</option>
                <option value="OLD">Old Tax Regime (With Sec 80C, 80D, HRA Exemption)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Risk Tolerance Mandate</label>
              <select
                value={riskProfile}
                onChange={e => setRiskProfile(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-400 shadow-2xs"
              >
                <option value="CONSERVATIVE">Conservative (Capital Preservation Focus)</option>
                <option value="MODERATE">Moderate (Balanced Multi-Asset Allocation)</option>
                <option value="AGGRESSIVE">Aggressive (High Domestic & Global Equity Tilt)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {savedSuccess && (
                <span className="text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1.5 font-medium animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>Parameters saved for this session (resets when page reopens)</span>
                </span>
              )}
              {resetSuccess && (
                <span className="text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5 font-medium animate-in fade-in">
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Default institutional parameters restored</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {isSessionModified && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleReset}
                  className="gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </Button>
              )}

              <Button type="submit" variant="primary" size="sm">
                Save Parameters
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
