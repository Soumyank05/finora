import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  Holding, 
  LifeGoal, 
  UserProfile, 
  StrategicInsight, 
  ChatMessage, 
  PortfolioSummary,
  AssetClass
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_HOLDINGS, 
  INITIAL_GOALS, 
  INITIAL_INSIGHTS 
} from '../data/mockData';
import { formatINR } from '../utils/formatters';

export type ThemeMode = 'light' | 'dark';

const SESSION_STORAGE_KEY = 'finora_user_session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity

interface UserSessionPayload {
  user: UserProfile;
  savedAt: number;
  expiresAt: number;
}

const loadSessionUser = (): UserProfile => {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return INITIAL_USER;
    const session: UserSessionPayload = JSON.parse(raw);
    const now = Date.now();
    if (session && session.user && session.expiresAt && now < session.expiresAt) {
      session.expiresAt = now + SESSION_TIMEOUT_MS;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      return session.user;
    }
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
  return INITIAL_USER;
};

interface WealthContextType {
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  resetUserToDefault: () => void;
  isSessionModified: boolean;
  holdings: Holding[];
  addHolding: (holding: Omit<Holding, 'id' | 'allocationPercent' | 'unrealizedPnL'>) => void;
  removeHolding: (id: string) => void;
  goals: LifeGoal[];
  addGoal: (goal: Omit<LifeGoal, 'id' | 'progressPercent' | 'isFunded'>) => void;
  updateGoalAmount: (id: string, newAmount: number) => void;
  insights: StrategicInsight[];
  summary: PortfolioSummary;
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  activeTab: 'portfolio' | 'advisor' | 'goals' | 'profile';
  setActiveTab: (tab: 'portfolio' | 'advisor' | 'goals' | 'profile') => void;
  isAddHoldingOpen: boolean;
  setIsAddHoldingOpen: (open: boolean) => void;
  isAddGoalOpen: boolean;
  setIsAddGoalOpen: (open: boolean) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
}

const WealthContext = createContext<WealthContextType | undefined>(undefined);

const ASSET_CONFIG: Record<AssetClass, { label: string; color: string }> = {
  MUTUAL_FUNDS: { label: 'Mutual Funds', color: '#0f172a' },
  EQUITY: { label: 'Direct Stocks', color: '#2563eb' },
  FIXED_INCOME: { label: 'Fixed Income (PPF/EPF)', color: '#475569' },
  GOLD: { label: 'Sovereign Gold Bonds', color: '#d97706' },
  LIQUID_CASH: { label: 'Cash & Liquid Savings', color: '#94a3b8' },
  REAL_ESTATE: { label: 'Real Estate', color: '#64748b' }
};

export const WealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(loadSessionUser);
  const [isSessionModified, setIsSessionModified] = useState<boolean>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return false;
      const session: UserSessionPayload = JSON.parse(raw);
      return Boolean(session && session.expiresAt && Date.now() < session.expiresAt);
    } catch {
      return false;
    }
  });
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_HOLDINGS);
  const [goals, setGoals] = useState<LifeGoal[]>(INITIAL_GOALS);
  const [insights] = useState<StrategicInsight[]>(INITIAL_INSIGHTS);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'advisor' | 'goals' | 'profile'>('portfolio');

  const [isAddHoldingOpen, setIsAddHoldingOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  // Monitor session expiration & extend on active user interactions
  useEffect(() => {
    const checkSession = () => {
      try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!raw) {
          if (isSessionModified) setIsSessionModified(false);
          return;
        }
        const session: UserSessionPayload = JSON.parse(raw);
        if (session && session.expiresAt && Date.now() > session.expiresAt) {
          // Session expired: restore default user parameters
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          setUser(INITIAL_USER);
          setIsSessionModified(false);
        }
      } catch {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        setUser(INITIAL_USER);
        setIsSessionModified(false);
      }
    };

    const interval = setInterval(checkSession, 15000);

    const handleUserActivity = () => {
      try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!raw) return;
        const session: UserSessionPayload = JSON.parse(raw);
        if (session && session.expiresAt && Date.now() < session.expiresAt) {
          session.expiresAt = Date.now() + SESSION_TIMEOUT_MS;
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('click', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [isSessionModified]);

  // Theme mode (light or dark)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('wealth_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('wealth_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Conversational advisor messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Hello ${user.name}. I've reviewed your Indian portfolio (**₹71.4 Lakhs**).\n\n**Quick Takeaways:**\n- **Emergency Reserve:** 7.3 months of expenses are liquid in HDFC Bank.\n- **Tax Planning:** The **New Tax Regime** saves you ~₹38,400 this fiscal year under Budget 2024 slabs.\n- **Cash Efficiency:** You have ~₹2.5 Lakhs in 3% savings; sweeping this to a Liquid/Arbitrage fund generates +₹8,400/yr post-tax.\n\nWhat would you like to analyze today?`,
      timestamp: 'Today at 11:30 AM'
    }
  ]);

  // Aggregate portfolio metrics
  const summary: PortfolioSummary = useMemo(() => {
    const netWorth = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
    const totalGain = netWorth - totalInvested;
    const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
    const monthlySIPTotal = holdings.reduce((sum, h) => sum + (h.sipAmount || 0), 0);
    const emergencyMonths = user.monthlyExpenses > 0 ? Number((550000 / user.monthlyExpenses).toFixed(1)) : 6;

    // Grouping by asset class
    const categoryTotals: Record<string, number> = {};
    holdings.forEach(h => {
      categoryTotals[h.category] = (categoryTotals[h.category] || 0) + h.currentValue;
    });

    const categoryBreakdown = Object.keys(categoryTotals).map(cat => {
      const assetCat = cat as AssetClass;
      const value = categoryTotals[cat];
      const percent = netWorth > 0 ? Number(((value / netWorth) * 100).toFixed(1)) : 0;
      return {
        category: assetCat,
        label: ASSET_CONFIG[assetCat]?.label || cat,
        value,
        percent,
        color: ASSET_CONFIG[assetCat]?.color || '#71717a'
      };
    }).sort((a, b) => b.value - a.value);

    return {
      netWorth,
      totalInvested,
      totalGain,
      totalGainPercent,
      monthlySIPTotal,
      emergencyMonths,
      categoryBreakdown
    };
  }, [holdings, user.monthlyExpenses]);

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => {
      const newUser = { ...prev, ...updated };
      try {
        const now = Date.now();
        const sessionPayload: UserSessionPayload = {
          user: newUser,
          savedAt: now,
          expiresAt: now + SESSION_TIMEOUT_MS
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
        setIsSessionModified(true);
      } catch (err) {
        console.error('Failed to store profile in sessionStorage:', err);
      }
      return newUser;
    });
  };

  const resetUserToDefault = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear sessionStorage:', err);
    }
    setUser(INITIAL_USER);
    setIsSessionModified(false);
  };

  const addHolding = (data: Omit<Holding, 'id' | 'allocationPercent' | 'unrealizedPnL'>) => {
    const unrealizedPnL = data.currentValue - data.invested;
    const newHolding: Holding = {
      ...data,
      id: `h-${Date.now()}`,
      unrealizedPnL,
      allocationPercent: 5.0
    };
    setHoldings(prev => [newHolding, ...prev]);
  };

  const removeHolding = (id: string) => {
    setHoldings(prev => prev.filter(h => h.id !== id));
  };

  const addGoal = (data: Omit<LifeGoal, 'id' | 'progressPercent' | 'isFunded'>) => {
    const progressPercent = Math.min(100, Math.round((data.currentAmount / data.targetAmount) * 100));
    const newGoal: LifeGoal = {
      ...data,
      id: `g-${Date.now()}`,
      progressPercent,
      isFunded: progressPercent >= 100
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalAmount = (id: string, newAmount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const progressPercent = Math.min(100, Math.round((newAmount / g.targetAmount) * 100));
        return {
          ...g,
          currentAmount: newAmount,
          progressPercent,
          isFunded: progressPercent >= 100
        };
      }
      return g;
    }));
  };

  const sendMessage = (text: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: now
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Intelligent advisory response logic
    setTimeout(() => {
      const q = text.toLowerCase();
      let response = '';

      if (q.includes('tax') || q.includes('regime') || q.includes('80c') || q.includes('budget')) {
        response = `### Tax Optimization Analysis (FY 2024-25 / AY 2025-26)\n\n**Recommendation: New Tax Regime**\n\n1. **Standard Deduction:** Enhanced to **₹75,000** for salaried professionals.\n2. **Break-Even Analysis:** For your annual in-hand salary of **${formatINR(user.monthlyIncome * 12, { compact: true })}**, the Old Regime only makes sense if you claim > **₹3.85 Lakhs** in combined 80C, 80D, and Home Loan interest.\n3. **Budget 2024 Capital Gains Rules:**\n   - **LTCG on Equity / Equity MFs:** 12.5% beyond the **₹1.25 Lakhs** exemption.\n   - **STCG on Equity:** 20% flat.\n   - **Sovereign Gold Bonds:** 100% tax-free capital gains upon 8-year RBI redemption.`;
      } else if (q.includes('retire') || q.includes('fire') || q.includes('freedom') || q.includes('corpus')) {
        response = `### Retirement Readiness (Age ${user.retirementAge})\n\n- **Target Corpus:** **₹3.50 Crores** (based on 6% inflation and 30x annual expenses)\n- **Accumulated Today:** **${formatINR(summary.netWorth, { compact: true })}**\n- **Monthly Savings:** **${formatINR(user.monthlyIncome - user.monthlyExpenses)}/mo**\n\n**Verdict:** Continuing your ₹55k/mo equity SIPs compounding at 11.5% CAGR puts you on track to surpass your goal by age ${user.retirementAge}. You do not need to take excess small-cap risk.`;
      } else if (q.includes('sip') || q.includes('mutual fund') || q.includes('allocation') || q.includes('invest')) {
        response = `### Strategic Monthly SIP Blueprint\n\nFor your **Moderate risk profile**, deploy monthly savings as follows:\n\n1. **Large Cap Index (Nifty 50):** 35% (Core benchmark anchor)\n2. **Flexi Cap (Parag Parikh):** 35% (Active alpha + global exposure)\n3. **Quality Midcap Fund:** 15% (Long-term Indian domestic growth)\n4. **PPF / Sovereign Debt:** 15% (Guaranteed tax-free cushion)`;
      } else {
        response = `### Portfolio Overview\n\n- **Net Worth:** **${formatINR(summary.netWorth, { compact: true })}** across 9 positions.\n- **Allocation:** 41% Mutual Funds, 19% Direct Stocks, 24% Debt (PPF/EPF), 9% Gold, 8% Liquid Cash.\n- **Top Action:** Deploy ₹2 Lakhs of excess savings cash into an Arbitrage Fund to improve post-tax yield.`;
      }

      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: now
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  return (
    <WealthContext.Provider
      value={{
        user,
        updateUser,
        resetUserToDefault,
        isSessionModified,
        holdings,
        addHolding,
        removeHolding,
        goals,
        addGoal,
        updateGoalAmount,
        insights,
        summary,
        chatMessages,
        sendMessage,
        activeTab,
        setActiveTab,
        isAddHoldingOpen,
        setIsAddHoldingOpen,
        isAddGoalOpen,
        setIsAddGoalOpen,
        theme,
        toggleTheme
      }}
    >
      {children}
    </WealthContext.Provider>
  );
};

export const useWealth = () => {
  const context = useContext(WealthContext);
  if (!context) throw new Error('useWealth must be used within WealthProvider');
  return context;
};
