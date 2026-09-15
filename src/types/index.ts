export type AssetClass = 
  | 'MUTUAL_FUNDS' 
  | 'EQUITY' 
  | 'FIXED_INCOME' 
  | 'GOLD' 
  | 'LIQUID_CASH' 
  | 'REAL_ESTATE';

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  category: AssetClass;
  invested: number;
  currentValue: number;
  unrealizedPnL: number;
  returnsPercent: number;
  xirr?: number;
  sipAmount?: number;
  broker: string;
  allocationPercent: number;
}

export interface LifeGoal {
  id: string;
  title: string;
  category: 'EMERGENCY' | 'HOME' | 'RETIREMENT' | 'EDUCATION' | 'TRAVEL' | 'CUSTOM';
  targetAmount: number;
  currentAmount: number;
  targetYear: number;
  monthlySIP: number;
  progressPercent: number;
  isFunded: boolean;
}

export interface UserProfile {
  name: string;
  city: string;
  age: number;
  retirementAge: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  taxRegime: 'NEW' | 'OLD';
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
}

export interface StrategicInsight {
  id: string;
  title: string;
  category: 'TAX' | 'CASH_DRAG' | 'REBALANCE' | 'ALLOCATION';
  summary: string;
  action: string;
  savingsOrGainINR?: number;
  priority: 'HIGH' | 'MEDIUM' | 'OPPORTUNITY';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface PortfolioSummary {
  netWorth: number;
  totalInvested: number;
  totalGain: number;
  totalGainPercent: number;
  monthlySIPTotal: number;
  emergencyMonths: number;
  categoryBreakdown: {
    category: AssetClass;
    label: string;
    value: number;
    percent: number;
    color: string;
  }[];
}
