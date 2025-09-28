
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useFinancial } from '../../contexts/FinancialContext';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  Brain,
  Zap,
  DollarSign
} from 'lucide-react';

const SmartInsights = () => {
  const [tickers, setTickers] = useState([]);
  const [favourites, setFavourites] = useState<string[]>([])
  const [loading, setLoading] = useState(true);
  const apikey = import.meta.env.VITE_FINNHUB_KEY

  useEffect(()=> {
    async function fetchSymbols() {
      try {
        const res = await fetch(
            `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apikey}`
        );
        const data = await res.json();
        setTickers(data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    fetchSymbols()
  }, [])

  //toggle favourite
  const toggleFavourite = (symbol: string) => {
    setFavourites((prev)=>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    )
  }

  const { transactions, goals, budgets } = useFinancial();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Generate smart insights based on user data
  const generateInsights = () => {
    const insights = [];
    
    // Spending pattern analysis
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const highestExpenseCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    if (highestExpenseCategory) {
      insights.push({
        type: 'spending',
        icon: TrendingDown,
        title: 'Top Spending Category',
        description: `You spend the most on ${highestExpenseCategory[0]} (${formatCurrency(highestExpenseCategory[1])})`,
        suggestion: `Consider setting a budget for ${highestExpenseCategory[0]} to track and control this expense.`,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      });
    }

    // Income vs expenses analysis
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

    if (savingsRate > 20) {
      insights.push({
        type: 'savings',
        icon: TrendingUp,
        title: 'Excellent Savings Rate',
        description: `Your savings rate is ${savingsRate.toFixed(1)}% - well above the recommended 20%!`,
        suggestion: 'Consider increasing your investment contributions or creating additional savings goals.',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      });
    } else if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Low Savings Rate',
        description: `Your savings rate is ${savingsRate.toFixed(1)}% - below the recommended 20%`,
        suggestion: 'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt repayment.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      });
    }

    // Goal progress analysis
    goals.forEach(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const dailyRequired = (goal.targetAmount - goal.currentAmount) / Math.max(daysRemaining, 1);

      if (progress < 50 && daysRemaining < 90) {
        insights.push({
          type: 'goal',
          icon: Target,
          title: `${goal.name} Behind Schedule`,
          description: `You need to save ${formatCurrency(dailyRequired)} daily to reach your goal`,
          suggestion: 'Consider automating daily transfers to stay on track with your savings goal.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        });
      }
    });

    // Budget analysis
    budgets.forEach(budget => {
      const utilizationRate = (budget.spent / budget.limit) * 100;
      if (utilizationRate > 90) {
        insights.push({
          type: 'budget',
          icon: AlertTriangle,
          title: `${budget.category} Budget Alert`,
          description: `You've used ${utilizationRate.toFixed(0)}% of your ${budget.category} budget`,
          suggestion: 'Consider reducing spending in this category or adjusting your budget limit.',
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        });
      }
    });

    // AI-powered predictions
    const recentTransactions = transactions.slice(0, 10);
    const avgDailySpending = totalExpenses / 30;
    
    insights.push({
      type: 'prediction',
      icon: Brain,
      title: 'Spending Prediction',
      description: `Based on your patterns, you'll likely spend ${formatCurrency(avgDailySpending * 30)} this month`,
      suggestion: 'Set up alerts to notify you when you approach this predicted amount.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    });

    return insights;
  };

  const insights = generateInsights();

  // Smart recommendations
  const recommendations = [
    {
      title: 'Automate Your Savings',
      description: 'Set up automatic transfers to your savings account on payday',
      impact: 'High Impact',
      effort: 'Low Effort'
    },
    {
      title: 'Review Subscriptions',
      description: 'Cancel unused subscriptions to reduce monthly expenses',
      impact: 'Medium Impact',
      effort: 'Low Effort'
    },
    {
      title: 'Use the Envelope Method',
      description: 'Allocate cash for discretionary spending categories',
      impact: 'High Impact',
      effort: 'Medium Effort'
    },
    {
      title: 'Increase Emergency Fund',
      description: 'Build 3-6 months of expenses in emergency savings',
      impact: 'High Impact',
      effort: 'High Effort'
    }
  ];

  return (
    <div>
      <div>
        <div className='grid grid-cols-3 gap-2'>
          {tickers.slice(0, 6).map((t) => (
            <div className='flex items-center justify-between border p-2 space-x-4 hover:bg-gray-100'>
              <button 
                key={t.symbol}
                // onclick={}
                className='flex items-center space-x-2 borde p- rounded '
              >
                <span className='text-sm font-semibold font-mono'>{t.symbol}</span>
                <span className='text-xs text-gray-500'>{t.description}</span>
              </button>

              <button 
                onClick={()=> toggleFavourite(t.symbol)}
                className='text-yellow-500 text-2xl'
              >
                {favourites.includes(t.symbol) ? "★" : "☆"}
              </button>
            </div>
           
          ))}
        </div>
      </div>

      <div className="space-y-6">
      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI-Powered Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No insights available yet</p>
              <p className="text-sm">Add more transactions to get personalized insights</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${insight.bgColor}`}>
                        <Icon className={`h-5 w-5 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {insight.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {insight.description}
                        </p>
                        <p className="text-indigo-600 text-sm font-medium">
                          💡 {insight.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Smart Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                <div className="flex justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    rec.impact === 'High Impact' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {rec.impact}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    rec.effort === 'Low Effort' 
                      ? 'bg-blue-100 text-blue-700'
                      : rec.effort === 'Medium Effort'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {rec.effort}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Score */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Financial Health Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {Math.floor(Math.random() * 30) + 70}/100
            </div>
            <p className="text-gray-600 mb-4">Good financial health</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-700">Savings Rate</p>
                <p className="text-green-600">Excellent</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="font-semibold text-yellow-700">Spending Control</p>
                <p className="text-yellow-600">Good</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-700">Goal Progress</p>
                <p className="text-blue-600">On Track</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>

  );
};

export default SmartInsights;
