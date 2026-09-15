import React, { useState, useMemo } from 'react';
import { useWealth } from '../../context/WealthContext';
import { formatINR } from '../../utils/formatters';
import { calculateIndianIncomeTax } from '../../utils/finance';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  CheckCircle2, 
  Scale, 
  Percent, 
  Receipt,
  FileCheck
} from 'lucide-react';

export const AdvisorDashboard: React.FC = () => {
  const { user, summary } = useWealth();

  // Target Asset Allocation Policy
  const [targetEquity, setTargetEquity] = useState<number>(60);
  const targetDebt = Math.max(0, 90 - targetEquity);
  const targetGold = 10;

  // Realized gains state for tax harvesting
  const realizedLTCGThisFY = 45000;
  const ltcgExemptionLimit = 125000; // Budget 2024 Section 112A
  const remainingLTCGRoom = Math.max(0, ltcgExemptionLimit - realizedLTCGThisFY);

  // Rebalancing calculation
  const rebalanceData = useMemo(() => {
    const netWorth = summary.netWorth;
    const currentEquityVal = (summary.categoryBreakdown.find(c => c.category === 'MUTUAL_FUNDS')?.value || 0) +
                             (summary.categoryBreakdown.find(c => c.category === 'EQUITY')?.value || 0);
    const currentDebtVal = (summary.categoryBreakdown.find(c => c.category === 'FIXED_INCOME')?.value || 0);
    const currentGoldVal = (summary.categoryBreakdown.find(c => c.category === 'GOLD')?.value || 0);
    const currentCashVal = (summary.categoryBreakdown.find(c => c.category === 'LIQUID_CASH')?.value || 0);

    const targetEquityVal = (netWorth * targetEquity) / 100;
    const targetDebtVal = (netWorth * targetDebt) / 100;
    const targetGoldVal = (netWorth * targetGold) / 100;

    const equityDrift = currentEquityVal - targetEquityVal;
    const debtDrift = currentDebtVal - targetDebtVal;
    const goldDrift = currentGoldVal - targetGoldVal;

    return {
      currentEquityPercent: Number(((currentEquityVal / netWorth) * 100).toFixed(1)),
      currentDebtPercent: Number(((currentDebtVal / netWorth) * 100).toFixed(1)),
      currentGoldPercent: Number(((currentGoldVal / netWorth) * 100).toFixed(1)),
      currentCashVal,
      equityDrift,
      debtDrift,
      goldDrift
    };
  }, [summary, targetEquity, targetDebt, targetGold]);

  // Tax comparison (Section 115BAC New vs Old Regime)
  const taxAnalysis = useMemo(() => {
    return calculateIndianIncomeTax({
      annualGrossSalary: user.monthlyIncome * 12,
      deductions80C: 150000,
      deductions80D: 25000
    });
  }, [user.monthlyIncome]);

  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({
    action1: true,
    action2: false,
    action3: false,
    action4: false
  });

  const toggleAction = (id: string) => {
    setCompletedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-slate-900 dark:text-slate-100">
      {/* Top Advisory Memorandum Header */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-start gap-3.5">
            <img 
              src="/finora-logo.png" 
              alt="Finora" 
              className="w-11 h-11 rounded-xl object-cover shadow-xs border border-slate-200/90 dark:border-slate-700/90 shrink-0 mt-0.5" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  FINORA FIDUCIARY DIRECTIVE
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Q3 FY 2024-25</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
                Finora Portfolio & Tax Advisory Directive
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Client: <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span> • Benchmark: Nifty 50 TRI + CRISIL Bond Index • Currency: INR (₹)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">Audit Status</span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Rebalance Recommended
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Current Portfolio Weight</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {rebalanceData.currentEquityPercent}% Eq / {rebalanceData.currentDebtPercent}% Debt
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Target: {targetEquity}% Eq / {targetDebt}% Debt</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">LTCG Tax-Free Room</span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {formatINR(remainingLTCGRoom)} left
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Section 112A (₹1.25L Cap)</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Annual Tax Savings</span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              +{formatINR(taxAnalysis.taxSavings)}/yr
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Via New Tax Regime</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Deployable Cash Buffer</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {formatINR(rebalanceData.currentCashVal)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">In HDFC Savings @ 3.0%</span>
          </div>
        </div>
      </Card>

      {/* Grid: Portfolio Rebalancing Engine + Capital Gains Tax Harvester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rebalancing Engine (7 cols) */}
        <Card className="lg:col-span-7 space-y-4 p-5 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Asset Allocation & Rebalancing Model
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calculate drift from target asset allocation and determine rupee deployments
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Model:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{targetEquity}% Equity / {targetDebt}% Debt</span>
            </div>
          </div>

          {/* Allocation Sliders */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Target Equity Allocation</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{targetEquity}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="80"
              step="5"
              value={targetEquity}
              onChange={e => setTargetEquity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-slate-100"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              <span>Conservative (40%)</span>
              <span>Balanced Growth (60%)</span>
              <span>Aggressive (80%)</span>
            </div>
          </div>

          {/* Asset Class Drift Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Asset Class</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actual %</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Target %</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Drift</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Rebalance Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">Equity (MF + Direct)</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{rebalanceData.currentEquityPercent}%</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{targetEquity}%</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    <span className={rebalanceData.equityDrift >= 0 ? "text-slate-600 dark:text-slate-400 font-medium" : "text-amber-600 dark:text-amber-400 font-medium"}>
                      {rebalanceData.equityDrift >= 0 ? '+' : ''}{formatINR(rebalanceData.equityDrift, { compact: true })}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium">
                    {rebalanceData.equityDrift < 0 ? (
                      <span className="text-blue-700 dark:text-blue-400">Deploy {formatINR(Math.abs(rebalanceData.equityDrift))}</span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">Maintain SIP</span>
                    )}
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">Fixed Income (PPF/EPF)</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{rebalanceData.currentDebtPercent}%</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{targetDebt}%</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    <span className={rebalanceData.debtDrift >= 0 ? "text-slate-600 dark:text-slate-400 font-medium" : "text-amber-600 dark:text-amber-400 font-medium"}>
                      {rebalanceData.debtDrift >= 0 ? '+' : ''}{formatINR(rebalanceData.debtDrift, { compact: true })}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium">
                    {rebalanceData.debtDrift < 0 ? (
                      <span className="text-slate-800 dark:text-slate-200">Add {formatINR(Math.abs(rebalanceData.debtDrift))} to PPF</span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">Optimal</span>
                    )}
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">Sovereign Gold Bonds</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{rebalanceData.currentGoldPercent}%</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{targetGold}%</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {rebalanceData.goldDrift >= 0 ? '+' : ''}{formatINR(rebalanceData.goldDrift, { compact: true })}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-500 dark:text-slate-400">
                    Hold to Maturity
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 border border-slate-200 dark:border-slate-700/80">
            <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0">Note:</span>
            <span>Do not sell appreciated equity to rebalance. Direct all new monthly surplus (₹1,25,000/mo) into the underweight asset class to avoid triggering short-term capital gains tax.</span>
          </div>
        </Card>

        {/* Budget 2024 Capital Gains Tax Harvester (5 cols) */}
        <Card className="lg:col-span-5 space-y-4 p-5 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              Budget 2024 Tax Harvester (Section 112A)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tax-loss harvesting and capital gains optimization
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Annual LTCG Exemption (Sec 112A):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">₹1,25,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Realized Gains (FY 2024-25):</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{formatINR(realizedLTCGThisFY)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Unused Tax-Free Gain Room:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 tabular-nums">{formatINR(remainingLTCGRoom)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Harvesting Recommendation:</span>
              <p className="leading-relaxed">
                You have <b>{formatINR(remainingLTCGRoom)}</b> in tax-free capital gains available before March 31, 2025.
                Redeeming and immediately repurchasing units of <i>UTI Nifty 50 Index</i> resets your cost base higher without paying a single rupee of LTCG tax.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Equity LTCG beyond ₹1.25L:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">12.5%</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Equity STCG (&lt;12 months):</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">20.0%</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>SGB Capital Gains at 8-yr maturity:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-bold">0.0% (Exempt)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Income Tax Regime Comparison Module (Budget 2024 New vs Old) */}
      <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              Budget 2024 Income Tax Regime Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Section 115BAC (Revised Slabs & ₹75,000 Standard Deduction) vs Old Tax Regime
            </p>
          </div>

          <Badge variant="success">
            Save {formatINR(taxAnalysis.taxSavings)}/yr under New Regime
          </Badge>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Tax Parameter</th>
                <th className="py-2.5 px-3 text-right font-semibold text-emerald-700 dark:text-emerald-400">New Regime (Sec 115BAC)</th>
                <th className="py-2.5 px-3 text-right font-semibold">Old Regime (With Exemptions)</th>
                <th className="py-2.5 px-3 text-right font-semibold">Variance / Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">Gross Annual Salary</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{formatINR(taxAnalysis.annualGrossSalary)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{formatINR(taxAnalysis.annualGrossSalary)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-500 dark:text-slate-400">—</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">Standard Deduction</td>
                <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-emerald-700 dark:text-emerald-400">₹75,000 (Budget 2024)</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">₹50,000</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400">+₹25,000 extra</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">Chapter VI-A (80C / 80D)</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-500 dark:text-slate-400">₹0 (Not applicable)</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{formatINR(taxAnalysis.oldRegime.totalDeductions)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-500 dark:text-slate-400">Forgone for lower slabs</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">Taxable Net Income</td>
                <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-900 dark:text-slate-100">{formatINR(taxAnalysis.newRegime.taxableIncome)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-900 dark:text-slate-100">{formatINR(taxAnalysis.oldRegime.taxableIncome)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-500 dark:text-slate-400">Lower tax slabs apply</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 font-semibold bg-emerald-50/40 dark:bg-emerald-950/20">
                <td className="py-2.5 px-3 text-slate-900 dark:text-slate-100">Total Tax Payable (Inc. Cess)</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400 text-sm font-bold">{formatINR(taxAnalysis.newRegime.totalTax)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300 text-sm">{formatINR(taxAnalysis.oldRegime.totalTax)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400 font-bold">-{formatINR(taxAnalysis.taxSavings)}/yr</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-[11px]">
                <td className="py-2 px-3 text-slate-500 dark:text-slate-400">Effective Tax Rate</td>
                <td className="py-2 px-3 text-right tabular-nums font-semibold text-emerald-700 dark:text-emerald-400">{taxAnalysis.newRegime.effectiveTaxRate}%</td>
                <td className="py-2 px-3 text-right tabular-nums text-slate-600 dark:text-slate-400">{taxAnalysis.oldRegime.effectiveTaxRate}%</td>
                <td className="py-2 px-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400">1.6% lower burden</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actionable Strategic Advisory Directives */}
      <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Actionable Directives Checklist (FY 2024-25)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Execute these 4 fiduciary wealth directives to optimize post-tax returns
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {Object.values(completedActions).filter(Boolean).length} of 4 completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div 
            onClick={() => toggleAction('action1')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              completedActions.action1 
                ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60' 
                : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                checked={completedActions.action1} 
                onChange={() => toggleAction('action1')}
                className="mt-1 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${completedActions.action1 ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    1. File Form 12BB for New Tax Regime
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
                    Save ₹38,400/yr
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Submit revised declaration to your employer to benefit from the Budget 2024 ₹75,000 standard deduction and lower slab rates.
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => toggleAction('action2')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              completedActions.action2 
                ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60' 
                : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                checked={completedActions.action2} 
                onChange={() => toggleAction('action2')}
                className="mt-1 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${completedActions.action2 ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    2. Sweep ₹2.0L Excess Savings into Arbitrage Fund
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-600">
                    +₹8,400/yr post-tax
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Transfer surplus idle cash from 3.0% HDFC Savings into HDFC Arbitrage Fund (6.8% yield with equity tax treatment).
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => toggleAction('action3')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              completedActions.action3 
                ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60' 
                : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                checked={completedActions.action3} 
                onChange={() => toggleAction('action3')}
                className="mt-1 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${completedActions.action3 ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    3. Maximize Annual PPF Contribution before April 5
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-600">
                    7.1% Tax-Free
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Deposit the remaining ₹80,000 to max out the ₹1.5L cap. Deposits before the 5th of any month earn interest for the entire month.
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => toggleAction('action4')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              completedActions.action4 
                ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60' 
                : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                checked={completedActions.action4} 
                onChange={() => toggleAction('action4')}
                className="mt-1 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${completedActions.action4 ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    4. Execute ₹80,000 Equity LTCG Harvest
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
                    ₹0 Tax on ₹80k gain
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Trigger partial sale and repurchase of UTI Nifty 50 Index Fund before March 31 to lock in the ₹1.25 Lakhs Section 112A exemption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
