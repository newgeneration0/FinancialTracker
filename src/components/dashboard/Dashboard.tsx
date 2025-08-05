import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFinancial } from '../../contexts/FinancialContext';
import Header from './Header';
import StatsCards from './StatsCards';
import QuickActions from './QuickActions';
import TransactionList from './TransactionList';
import GoalsSection from './GoalsSection';
import Analytics from './Analytics';
import SmartInsights from './SmartInsights';
import DailyTip from './DailyTip';
import BudgetOverview from './BudgetOverview';
import SocialFeatures from './SocialFeatures';
import UserProfile from './UserProfile';
import RecurringTransactions from './RecurringTransaction';
import Notification from './Notification';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const firstName = user?.firstName || localStorage.getItem('firstName') || 'Friend';
  const { balance, totalIncome, totalExpenses } = useFinancial();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <QuickActions />
                <TransactionList />
              </div>
              <div className="space-y-6">
                <DailyTip />
                <GoalsSection />
                <BudgetOverview />
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return <Analytics />;
      case 'goals':
        return <GoalsSection detailed />;
      case 'insights':
        return <SmartInsights />;
      case 'social':
        return <SocialFeatures />;
      case 'profile' :
        return <UserProfile />;
      case 'recurringTransactions' :
        return <RecurringTransactions />;
      case 'notification' :
        return <Notification />
      default:
        return (
          <div className="space-y-6">
            <StatsCards />
            <QuickActions />
            <TransactionList />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transitio-colors duratio-300">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {/* Welcome back, {user?.firstName || 'Friend'}! 👋 */}
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
            Here's your financial overview for today
          </p>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
