import React, { useState, useMemo } from 'react';
import { useWealth } from '../../context/WealthContext';
import { formatINR, formatPercentage } from '../../utils/formatters';
import { Stat } from '../ui/Stat';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Search, 
  ArrowUpDown, 
  Layers,
  Download
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AssetClass } from '../../types';

type SortField = 'currentValue' | 'invested' | 'returnsPercent' | 'sipAmount' | 'name';
type SortOrder = 'asc' | 'desc';

const CATEGORY_META: Record<AssetClass, { label: string; badge: string; color: string; border: string }> = {
  MUTUAL_FUNDS: { label: 'Mutual Funds', badge: 'MF', color: 'bg-slate-100 text-slate-800', border: 'border-slate-300' },
  EQUITY: { label: 'Direct Stocks', badge: 'EQ', color: 'bg-blue-50 text-blue-800', border: 'border-blue-200' },
  FIXED_INCOME: { label: 'Fixed Income', badge: 'DEBT', color: 'bg-slate-100 text-slate-700', border: 'border-slate-300' },
  GOLD: { label: 'Sovereign Gold', badge: 'GOLD', color: 'bg-amber-50 text-amber-800', border: 'border-amber-200' },
  LIQUID_CASH: { label: 'Cash & Liquid', badge: 'CASH', color: 'bg-slate-50 text-slate-600', border: 'border-slate-200' },
  REAL_ESTATE: { label: 'Real Estate', badge: 'RE', color: 'bg-slate-100 text-slate-700', border: 'border-slate-200' }
};

export const PortfolioOverview: React.FC = () => {
  const { summary, holdings, removeHolding, setIsAddHoldingOpen } = useWealth();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('currentValue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const processedHoldings = useMemo(() => {
    let list = holdings.filter(h => {
      const matchCat = selectedCategory === 'ALL' || h.category === selectedCategory;
      const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.broker.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'sipAmount') {
        valA = a.sipAmount || 0;
        valB = b.sipAmount || 0;
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [holdings, selectedCategory, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Instrument', 'Ticker', 'Category', 'Broker', 'Invested (INR)', 'Current Value (INR)', 'Returns (%)', 'Monthly SIP (INR)', 'XIRR (%)'];
    const rows = holdings.map(h => [
      `"${h.name}"`,
      h.ticker,
      h.category,
      h.broker,
      h.invested,
      h.currentValue,
      h.returnsPercent,
      h.sipAmount || 0,
      h.xirr || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `portfolio_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = [
    { id: 'ALL', label: 'All Holdings', count: holdings.length },
    { id: 'MUTUAL_FUNDS', label: 'Mutual Funds', count: holdings.filter(h => h.category === 'MUTUAL_FUNDS').length },
    { id: 'EQUITY', label: 'Direct Stocks', count: holdings.filter(h => h.category === 'EQUITY').length },
    { id: 'FIXED_INCOME', label: 'PPF & EPF', count: holdings.filter(h => h.category === 'FIXED_INCOME').length },
    { id: 'GOLD', label: 'Gold & SGB', count: holdings.filter(h => h.category === 'GOLD').length },
    { id: 'LIQUID_CASH', label: 'Cash Reserve', count: holdings.filter(h => h.category === 'LIQUID_CASH').length }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Total Portfolio Value"
          value={formatINR(summary.netWorth, { compact: true })}
          subtext={`Exact: ${formatINR(summary.netWorth)}`}
          icon={<Wallet className="w-4 h-4 text-slate-400" />}
        />
        <Stat
          label="Unrealized Portfolio Gains"
          value={`+${formatINR(summary.totalGain, { compact: true })}`}
          subtext={`Invested: ${formatINR(summary.totalInvested, { compact: true })}`}
          change={summary.totalGainPercent}
          changeLabel="net return"
          icon={<TrendingUp className="w-4 h-4 text-slate-400" />}
        />
        <Stat
          label="Monthly SIP Mandate"
          value={`${formatINR(summary.monthlySIPTotal)}/mo`}
          subtext="Active bank auto-debits"
          icon={<PiggyBank className="w-4 h-4 text-slate-400" />}
        />
        <Stat
          label="Liquid Emergency Runway"
          value={`${summary.emergencyMonths} Months`}
          subtext="₹5.5L liquid in HDFC Bank"
          icon={<ShieldCheck className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* Proportional Asset Allocation Bar */}
      <Card className="p-4 space-y-3 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">Asset Allocation Proportions</span>
            <span className="text-[11px] text-slate-500">({summary.categoryBreakdown.length} asset classes)</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Equity/Debt Split: <span className="font-semibold text-slate-900 dark:text-slate-100">59.5% Equity / 40.5% Debt & Ballast</span>
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
          {summary.categoryBreakdown.map((item) => (
            <div
              key={item.category}
              style={{
                width: `${item.percent}%`,
                backgroundColor: item.color
              }}
              className="h-full transition-all duration-300 hover:opacity-90 relative cursor-pointer"
              title={`${item.label}: ${formatINR(item.value)} (${item.percent}%)`}
            />
          ))}
        </div>

        {/* Legend Chips */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[11px]">
          {summary.categoryBreakdown.map((item) => (
            <button
              key={item.category}
              onClick={() => setSelectedCategory(selectedCategory === item.category ? 'ALL' : item.category)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all ${
                selectedCategory === item.category
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-medium">{item.label}</span>
              <span className={selectedCategory === item.category ? 'text-slate-300 tabular-nums' : 'text-slate-400 tabular-nums'}>{item.percent}%</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Main Grid: Donut Breakdown + Interactive Holdings Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart (4 cols) */}
        <Card className="lg:col-span-4 flex flex-col justify-between p-5 space-y-4 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
          <CardHeader
            title="Portfolio Weighting"
            subtitle="Current exposure distribution"
          />

          <div className="h-56 w-full relative my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs shadow-md font-sans">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{d.label}</div>
                          <div className="text-slate-700 dark:text-slate-300 font-medium mt-0.5 tabular-nums">
                            {formatINR(d.value)} ({d.percent}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={summary.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {summary.categoryBreakdown.map(entry => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">Total Value</span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {formatINR(summary.netWorth, { compact: true })}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
            {summary.categoryBreakdown.map(item => (
              <div 
                key={item.category} 
                onClick={() => setSelectedCategory(selectedCategory === item.category ? 'ALL' : item.category)}
                className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                  selectedCategory === item.category ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-slate-500 dark:text-slate-400">{formatINR(item.value, { compact: true })}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 w-11 text-right">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Holdings Table Ledger (8 cols) */}
        <Card className="lg:col-span-8 space-y-4 p-5 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Investment Ledger & Assets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Valuation, purchase price, monthly SIPs, and broker details
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={exportToCSV}
                className="gap-1.5"
                title="Download CSV Statement"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </Button>

              <Button 
                size="sm" 
                variant="primary" 
                onClick={() => setIsAddHoldingOpen(true)} 
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </Button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search bar & Sorting control */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search instrument name, ticker, or broker..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 text-slate-500 shrink-0">
              <span className="text-[11px] hidden sm:inline">Sort by:</span>
              <select
                value={sortField}
                onChange={e => handleSort(e.target.value as SortField)}
                className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400"
              >
                <option value="currentValue">Current Value</option>
                <option value="invested">Invested Amount</option>
                <option value="returnsPercent">Total Returns %</option>
                <option value="sipAmount">Monthly SIP</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                  <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-slate-100" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      <span>Instrument</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-slate-100" onClick={() => handleSort('invested')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Invested</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-slate-100" onClick={() => handleSort('currentValue')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Current Value</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-slate-100" onClick={() => handleSort('returnsPercent')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Total Gain</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-slate-100" onClick={() => handleSort('sipAmount')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Monthly SIP</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-2 text-center font-medium w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {processedHoldings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No holdings match your search or filter.
                    </td>
                  </tr>
                ) : (
                  processedHoldings.map(h => {
                    const isPositive = h.returnsPercent >= 0;
                    const meta = CATEGORY_META[h.category] || CATEGORY_META.MUTUAL_FUNDS;

                    return (
                      <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${meta.color} ${meta.border}`}>
                              {meta.badge}
                            </span>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">{h.name}</div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                                <span>{h.broker}</span>
                                <span>•</span>
                                <span className="font-mono text-slate-600 dark:text-slate-400">{h.ticker}</span>
                                {h.xirr && (
                                  <>
                                    <span>•</span>
                                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{h.xirr}% XIRR</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                          {formatINR(h.invested)}
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          {formatINR(h.currentValue)}
                        </td>
                        <td className="py-3 px-3 text-right tabular-nums">
                          <div className={isPositive ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-rose-700 dark:text-rose-400 font-semibold'}>
                            {formatPercentage(h.returnsPercent)}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            +{formatINR(h.currentValue - h.invested, { compact: true })}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-800 dark:text-slate-200 font-medium tabular-nums">
                          {h.sipAmount ? `${formatINR(h.sipAmount)}/mo` : '—'}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => removeHolding(h.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Remove position"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {/* Summary Footer */}
              {processedHoldings.length > 0 && (
                <tfoot>
                  <tr className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-[11px] text-slate-900 dark:text-slate-100">
                    <td className="py-2.5 px-3">
                      Total ({processedHoldings.length} positions)
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {formatINR(processedHoldings.reduce((sum, h) => sum + h.invested, 0))}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-900 dark:text-slate-100">
                      {formatINR(processedHoldings.reduce((sum, h) => sum + h.currentValue, 0))}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                      +{formatINR(processedHoldings.reduce((sum, h) => sum + (h.currentValue - h.invested), 0), { compact: true })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-900 dark:text-slate-100">
                      {formatINR(processedHoldings.reduce((sum, h) => sum + (h.sipAmount || 0), 0))}/mo
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
