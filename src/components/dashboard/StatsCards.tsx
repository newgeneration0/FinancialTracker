
import React, { useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { useFinancial } from '../../contexts/FinancialContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

const StatsCards = () => {
  const { totalIncome, totalExpenses, balance, goals, calculateMonthlyChange  } = useFinancial();
  const { formatCurrency } = useCurrency();
  // const balanceChange = calculateMonthlyChange('balance');
  // const incomeChange = calculateMonthlyChange('income');
  // const expenseChange = calculateMonthlyChange('expense');
  const incomeChange = useMemo(() => calculateMonthlyChange('income'), [calculateMonthlyChange]);
  const expenseChange = useMemo(() => calculateMonthlyChange('expense'), [calculateMonthlyChange]);
  const balanceChange = useMemo(() => calculateMonthlyChange('balance'), [calculateMonthlyChange]);

  const totalGoalsAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);


//   console.log('Income change:', incomeChange);
// console.log('Expense change:', expenseChange);
// console.log('Balance change:', balanceChange);

  const stats = [
    {
      title: 'Total Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      trend: balance >= 0 ? 'up' : 'down',
      color: balance >= 0 ? 'text-green-600 dark:text-green-700' : 'text-red-600 dark:text-red-400',
      bgColor: balance >= 0 ? 'bg-green-100 dark:bg-green-400' : 'bg-red-100 dark:bg-red-400',
      percentageChange: balanceChange,
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      trend: 'up',
      color: 'text-green-600 dark:text-green-700',
      bgColor: 'bg-green-100 dark:bg-green-400',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      trend: 'down',
      color: 'text-red-600 dark:text-red-700',
      bgColor: 'bg-red-100 dark:bg-red-400',
    },
    {
      title: 'Savings Goals',
      value: formatCurrency(totalGoalsAmount),
      icon: Target,
      trend: 'up',
      color: 'text-blue-600 dark:text-blue-700',
      bgColor: 'bg-blue-100 dark:bg-blue-400',
      // subtext: `${formatCurrency(totalSaved)} of ${formatCurrency(totalSavingsGoals)}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200 bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              {/* <div className="mt-4 flex items-center text-sm">
                <span className={`flex items-center ${stat.color}`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.floor(Math.random() * 15) + 5}%
                </span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div> */}
              <div className="mt-4 flex items-center text-sm">
  <span className={`flex items-center ${stat.color}`}>
    {stat.trend === 'up' ? (
      <TrendingUp className="h-4 w-4 mr-1" />
    ) : (
      <TrendingDown className="h-4 w-4 mr-1" />
    )}
    {stat.percentageChange !== null && stat.percentageChange !== undefined
      ? `${stat.percentageChange.toFixed(1)}%`
      : '–'}
  </span>
  <span className="text-gray-500 ml-2">vs last month</span>
</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
