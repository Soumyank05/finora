import { Holding, LifeGoal, UserProfile, StrategicInsight } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Soumyank S.',
  city: 'Bengaluru, Karnataka',
  age: 31,
  retirementAge: 50,
  monthlyIncome: 240000, // ₹2.4 Lakhs
  monthlyExpenses: 75000, // ₹75k living expense
  taxRegime: 'NEW',
  riskProfile: 'MODERATE'
};

export const INITIAL_HOLDINGS: Holding[] = [
  {
    id: 'h-1',
    name: 'Parag Parikh Flexi Cap Direct-Growth',
    ticker: 'PPFAS-DIR',
    category: 'MUTUAL_FUNDS',
    invested: 1200000,
    currentValue: 1680000,
    unrealizedPnL: 480000,
    returnsPercent: 40.0,
    xirr: 19.8,
    sipAmount: 25000,
    broker: 'Groww',
    allocationPercent: 23.5
  },
  {
    id: 'h-2',
    name: 'UTI Nifty 50 Index Fund Direct-Growth',
    ticker: 'NIFTY50-DIR',
    category: 'MUTUAL_FUNDS',
    invested: 900000,
    currentValue: 1220000,
    unrealizedPnL: 320000,
    returnsPercent: 35.5,
    xirr: 15.4,
    sipAmount: 20000,
    broker: 'Zerodha Coin',
    allocationPercent: 17.1
  },
  {
    id: 'h-3',
    name: 'HDFC Bank Ltd',
    ticker: 'HDFCBANK',
    category: 'EQUITY',
    invested: 420000,
    currentValue: 510000,
    unrealizedPnL: 90000,
    returnsPercent: 21.4,
    broker: 'Zerodha Kite',
    allocationPercent: 7.1
  },
  {
    id: 'h-4',
    name: 'Reliance Industries Ltd',
    ticker: 'RELIANCE',
    category: 'EQUITY',
    invested: 380000,
    currentValue: 475000,
    unrealizedPnL: 95000,
    returnsPercent: 25.0,
    broker: 'Zerodha Kite',
    allocationPercent: 6.7
  },
  {
    id: 'h-5',
    name: 'Tata Consultancy Services',
    ticker: 'TCS',
    category: 'EQUITY',
    invested: 320000,
    currentValue: 365000,
    unrealizedPnL: 45000,
    returnsPercent: 14.1,
    broker: 'Zerodha Kite',
    allocationPercent: 5.1
  },
  {
    id: 'h-6',
    name: 'Public Provident Fund (PPF - 7.1% Tax-Free)',
    ticker: 'PPF-SBI',
    category: 'FIXED_INCOME',
    invested: 750000,
    currentValue: 940000,
    unrealizedPnL: 190000,
    returnsPercent: 25.3,
    sipAmount: 12500,
    broker: 'State Bank of India',
    allocationPercent: 13.2
  },
  {
    id: 'h-7',
    name: "Employees' Provident Fund (EPF - 8.25%)",
    ticker: 'EPF-GOV',
    category: 'FIXED_INCOME',
    invested: 650000,
    currentValue: 780000,
    unrealizedPnL: 130000,
    returnsPercent: 20.0,
    broker: 'EPFO India',
    allocationPercent: 10.9
  },
  {
    id: 'h-8',
    name: 'Sovereign Gold Bonds (SGB 2028 Series)',
    ticker: 'SGB-RBI',
    category: 'GOLD',
    invested: 400000,
    currentValue: 620000,
    unrealizedPnL: 220000,
    returnsPercent: 55.0,
    broker: 'RBI Demat',
    allocationPercent: 8.7
  },
  {
    id: 'h-9',
    name: 'HDFC Savings & Auto-Sweep Liquid Deposit',
    ticker: 'CASH-HDFC',
    category: 'LIQUID_CASH',
    invested: 550000,
    currentValue: 550000,
    unrealizedPnL: 0,
    returnsPercent: 0.0,
    broker: 'HDFC Bank',
    allocationPercent: 7.7
  }
];

export const INITIAL_GOALS: LifeGoal[] = [
  {
    id: 'g-1',
    title: 'Emergency Runway (6 Months Living Expenses)',
    category: 'EMERGENCY',
    targetAmount: 450000,
    currentAmount: 550000,
    targetYear: 2026,
    monthlySIP: 0,
    progressPercent: 100,
    isFunded: true
  },
  {
    id: 'g-2',
    title: 'Bengaluru Apartment Down Payment',
    category: 'HOME',
    targetAmount: 3000000,
    currentAmount: 2250000,
    targetYear: 2027,
    monthlySIP: 40000,
    progressPercent: 75,
    isFunded: false
  },
  {
    id: 'g-3',
    title: 'Financial Independence & Early Retirement (FIRE)',
    category: 'RETIREMENT',
    targetAmount: 35000000, // ₹3.50 Crores
    currentAmount: 7140000,
    targetYear: 2043,
    monthlySIP: 55000,
    progressPercent: 20.4,
    isFunded: false
  },
  {
    id: 'g-4',
    title: 'Family Vacation Fund (Japan / Europe)',
    category: 'TRAVEL',
    targetAmount: 450000,
    currentAmount: 320000,
    targetYear: 2027,
    monthlySIP: 15000,
    progressPercent: 71.1,
    isFunded: false
  }
];

export const INITIAL_INSIGHTS: StrategicInsight[] = [
  {
    id: 'ins-1',
    title: 'Cash Drag: ₹2,50,000 Surplus in Low-Yield Savings',
    category: 'CASH_DRAG',
    summary: 'Your savings account balance is ₹5.5 Lakhs, which exceeds your 6-month emergency requirement by ₹1 Lakh.',
    action: 'Transfer ₹2,00,000 into an Arbitrage Fund or Multi-Asset Liquid Fund yielding 7.2% with 12.5% LTCG tax treatment instead of 30% slab rate on bank FD interest.',
    savingsOrGainINR: 8400,
    priority: 'HIGH'
  },
  {
    id: 'ins-2',
    title: 'Tax Regime Optimization: New Regime Saves You ₹38,400',
    category: 'TAX',
    summary: 'Under the revised Budget 2024 slabs, your taxable income benefits from the enhanced ₹75,000 standard deduction.',
    action: 'Continue opting for the New Tax Regime. You would need itemized deductions exceeding ₹3.85 Lakhs for the Old Regime to break even.',
    savingsOrGainINR: 38400,
    priority: 'HIGH'
  },
  {
    id: 'ins-3',
    title: 'Home Down Payment Timeline: On Track for Oct 2027',
    category: 'ALLOCATION',
    summary: 'Your down payment corpus has reached ₹22.5 Lakhs (75% of your ₹30 Lakhs milestone).',
    action: 'As you enter the final 18 months before purchase, systematically park this money in low-duration debt funds to eliminate stock market volatility.',
    priority: 'MEDIUM'
  },
  {
    id: 'ins-4',
    title: 'Sovereign Gold Bonds: 100% Tax-Free Capital Gains',
    category: 'TAX',
    summary: 'Your SGB tranche has gained 55% from issue price, providing valuable inflation hedging.',
    action: 'Hold until final 8-year RBI redemption to claim complete capital gains tax exemption under Section 47 of the Income Tax Act.',
    priority: 'OPPORTUNITY'
  }
];
