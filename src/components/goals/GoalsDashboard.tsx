import React, { useState, useMemo, useEffect } from 'react';
import { useWealth } from '../../context/WealthContext';
import { formatINR, formatPercentage } from '../../utils/formatters';
import { calculateRetirementPlan, generateCorpusTrajectory } from '../../utils/finance';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Target, 
  Home, 
  ShieldCheck, 
  Plane, 
  GraduationCap, 
  Plus, 
  Calendar, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export const GoalsDashboard: React.FC = () => {
  const { goals, setIsAddGoalOpen, user, summary, theme } = useWealth();

  // Retirement simulation parameters
  const [retireAge, setRetireAge] = useState<number>(user.retirementAge);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(user.monthlyExpenses);

  // Sync with user profile state changes
  useEffect(() => {
    setRetireAge(user.retirementAge);
    setMonthlyExpense(user.monthlyExpenses);
  }, [user.retirementAge, user.monthlyExpenses]);

  const retirementPlan = useMemo(() => {
    return calculateRetirementPlan({
      currentAge: user.age,
      retirementAge: retireAge,
      currentMonthlyExpense: monthlyExpense,
      currentNetWorth: summary.netWorth,
      monthlySavings: user.monthlyIncome - monthlyExpense,
      expectedPreRetirementReturn: 11.5,
      inflationRate: 6.0
    });
  }, [user.age, retireAge, monthlyExpense, summary.netWorth, user.monthlyIncome]);

  const trajectoryData = useMemo(() => {
    return generateCorpusTrajectory({
      currentAge: user.age,
      retirementAge: retireAge,
      currentNetWorth: summary.netWorth,
      monthlySavings: Math.max(0, user.monthlyIncome - monthlyExpense),
      annualReturnRate: 11.5,
      inflationRate: 6.0,
      currentMonthlyExpense: monthlyExpense
    });
  }, [user.age, retireAge, summary.netWorth, user.monthlyIncome, monthlyExpense]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'HOME': return Home;
      case 'EMERGENCY': return ShieldCheck;
      case 'TRAVEL': return Plane;
      case 'EDUCATION': return GraduationCap;
      default: return Target;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Financial Goals & Retirement Solvency
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Committed capital allocations, target horizons, and 30x FIRE rule compounding in India.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddGoalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal Horizon</span>
        </Button>
      </div>

      {/* Grid of Life Goals (2 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map(goal => {
          const Icon = getCategoryIcon(goal.category);
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <Card key={goal.id} className="space-y-4 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg border ${
                    goal.isFunded 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{goal.title}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Horizon: {goal.targetYear}</span>
                    </div>
                  </div>
                </div>

                {goal.isFunded ? (
                  <Badge variant="success">Fully Funded ✓</Badge>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                    {goal.progressPercent}% funded
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs tabular-nums">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatINR(goal.currentAmount, { compact: true })}</span>
                  <span className="font-medium text-slate-600">Target: {formatINR(goal.targetAmount, { compact: true })}</span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      goal.isFunded ? 'bg-emerald-600' : 'bg-slate-900 dark:bg-slate-100'
                    }`}
                    style={{ width: `${Math.min(100, goal.progressPercent)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
                  {remaining > 0 ? (
                    <span>{formatINR(remaining, { compact: true })} remaining</span>
                  ) : (
                    <span className="text-emerald-700 font-medium">Goal capital secured</span>
                  )}
                  <span>Est. {Math.max(0, goal.targetYear - new Date().getFullYear())} yrs away</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Committed Monthly SIP:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {goal.monthlySIP > 0 ? `${formatINR(goal.monthlySIP)}/mo` : 'Fully Funded'}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Retirement / FIRE Model in India */}
      <Card className="space-y-5">
        <CardHeader
          title="Retirement Corpus & Solvency Projection"
          subtitle="Simulated using 6.0% long-term inflation, 30x annual expenditure multiple, and 11.50% equity CAGR."
          action={
            <Badge variant={retirementPlan.isFunded ? 'success' : 'warning'}>
              {retirementPlan.isFunded ? 'FIRE Target Achievable' : 'Corpus Shortfall Detected'}
            </Badge>
          }
        />

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50/70 dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Target Retirement Age</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                Age {retireAge} ({retirementPlan.yearsToRetirement} years left)
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="65"
              value={retireAge}
              onChange={e => setRetireAge(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-slate-100"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Monthly Living Cost Today</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {formatINR(monthlyExpense)}/mo
              </span>
            </div>
            <input
              type="range"
              min="35000"
              max="250000"
              step="5000"
              value={monthlyExpense}
              onChange={e => setMonthlyExpense(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-slate-100"
            />
          </div>
        </div>

        {/* Wealth Trajectory Chart */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Corpus Trajectory vs Target Benchmark (Age {user.age} → Age {retireAge})
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-slate-900 dark:bg-slate-100 rounded-full" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Projected Corpus (11.5% CAGR)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-t-2 border-dashed border-amber-600" />
                <span className="text-slate-500">Target Capital Requirement</span>
              </div>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="wealthGradientLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme === "dark" ? "#38bdf8" : "#0f172a"} stopOpacity={theme === "dark" ? 0.2 : 0.08} />
                    <stop offset="95%" stopColor={theme === "dark" ? "#38bdf8" : "#0f172a"} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#334155" : "#e2e8f0"} vertical={false} />
                <XAxis 
                  dataKey="age" 
                  stroke={theme === "dark" ? "#94a3b8" : "#64748b"} 
                  fontSize={11} 
                  tickFormatter={(age) => `Age ${age}`}
                  tickLine={false}
                />
                <YAxis 
                  stroke={theme === "dark" ? "#94a3b8" : "#64748b"} 
                  fontSize={11} 
                  tickFormatter={(v) => formatINR(v, { compact: true })} 
                  width={75}
                  tickLine={false}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-md text-xs space-y-1 font-sans">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">At Age {label}</div>
                          <div className="text-slate-900 dark:text-slate-100 font-semibold tabular-nums">
                            Projected Portfolio: {formatINR(payload[0].value as number)}
                          </div>
                          <div className="text-amber-700 font-medium tabular-nums">
                            Target Threshold: {formatINR(payload[1]?.value as number || 0)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolio" 
                  name="Portfolio Value"
                  stroke={theme === "dark" ? "#38bdf8" : "#0f172a"} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#wealthGradientLight)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="targetCorpus" 
                  name="Target Corpus"
                  stroke="#d97706" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4"
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Math Outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Future Annual Outflow</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {formatINR(retirementPlan.futureAnnualExpense, { compact: true })}/yr
            </div>
            <span className="text-[11px] text-slate-500">Indexed at 6% annual inflation</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Target Capital (30x Rule)</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {formatINR(retirementPlan.targetCorpus, { compact: true })}
            </div>
            <span className="text-[11px] text-slate-500">Perpetual post-retirement sustainability</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Projected Capital at Age {retireAge}</span>
            <div className="text-lg font-bold text-emerald-800 dark:text-emerald-400 tabular-nums">
              {formatINR(retirementPlan.projectedCorpus, { compact: true })}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {retirementPlan.isFunded 
                ? `+${formatINR(retirementPlan.surplusOrShortfall, { compact: true })} estimated surplus` 
                : 'Accelerate monthly SIPs'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
