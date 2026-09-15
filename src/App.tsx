import React from 'react';
import { WealthProvider, useWealth } from './context/WealthContext';
import { Navbar } from './components/layout/Navbar';
import { PortfolioOverview } from './components/portfolio/PortfolioOverview';
import { AdvisorDashboard } from './components/advisor/AdvisorDashboard';
import { GoalsDashboard } from './components/goals/GoalsDashboard';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { AddHoldingModal } from './components/portfolio/AddHoldingModal';
import { AddGoalModal } from './components/goals/AddGoalModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useWealth();

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-slate-200 selection:text-slate-900 dark:selection:bg-slate-800 dark:selection:text-slate-100 transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {activeTab === 'portfolio' && <PortfolioOverview />}
        {activeTab === 'advisor' && <AdvisorDashboard />}
        {activeTab === 'goals' && <GoalsDashboard />}
        {activeTab === 'profile' && <ProfileSettings />}
      </main>

      <AddHoldingModal />
      <AddGoalModal />
    </div>
  );
};

export default function App() {
  return (
    <WealthProvider>
      <MainLayout />
    </WealthProvider>
  );
}

