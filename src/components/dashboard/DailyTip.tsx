
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Lightbulb, RefreshCw, Heart } from 'lucide-react';

const DailyTip = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const financialTips = [
    {
      tip: "Track every expense for a week to understand your spending patterns better.",
      category: "Budgeting",
      difficulty: "Easy"
    },
    {
      tip: "Pay yourself first - save 20% of your income before spending on anything else.",
      category: "Saving",
      difficulty: "Medium"
    },
    {
      tip: "Use the 24-hour rule: wait a day before making any purchase over $100.",
      category: "Spending",
      difficulty: "Easy"
    },
    {
      tip: "Automate your savings to remove the temptation to spend first.",
      category: "Automation",
      difficulty: "Easy"
    },
    {
      tip: "Review and cancel unused subscriptions monthly to avoid wasteful spending.",
      category: "Optimization",
      difficulty: "Easy"
    },
    {
      tip: "Build an emergency fund with 3-6 months of living expenses.",
      category: "Emergency Fund",
      difficulty: "Hard"
    },
    {
      tip: "Use cashback credit cards for purchases you'd make anyway, but pay them off monthly.",
      category: "Credit",
      difficulty: "Medium"
    },
    {
      tip: "Invest in low-cost index funds for long-term wealth building.",
      category: "Investing",
      difficulty: "Medium"
    },
    {
      tip: "Set specific, measurable financial goals with deadlines.",
      category: "Goals",
      difficulty: "Easy"
    },
    {
      tip: "Cook at home more often - it can save you $200+ per month.",
      category: "Lifestyle",
      difficulty: "Easy"
    },
    {
      tip: "Negotiate your bills annually - you might save 10-20% on services.",
      category: "Optimization",
      difficulty: "Medium"
    },
    {
      tip: "Use the envelope method for discretionary spending categories.",
      category: "Budgeting",
      difficulty: "Medium"
    },
    {
      tip: "Start investing early - even $25/month can grow significantly over time.",
      category: "Investing",
      difficulty: "Easy"
    },
    {
      tip: "Keep your housing costs below 30% of your income.",
      category: "Housing",
      difficulty: "Hard"
    },
    {
      tip: "Use price comparison tools before making significant purchases.",
      category: "Shopping",
      difficulty: "Easy"
    }
  ];

  useEffect(() => {
    // Change tip daily based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setCurrentTipIndex(dayOfYear % financialTips.length);
  }, []);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % financialTips.length);
    setLiked(false);
  };

  const currentTip = financialTips[currentTipIndex];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span className="text-gray-900">Daily Financial Tip</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextTip}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-yellow-100">
          <p className="text-gray-800 text-sm leading-relaxed mb-3">
            {currentTip.tip}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {currentTip.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentTip.difficulty)}`}>
                {currentTip.difficulty}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLiked(!liked)}
              className={`${
                liked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              } hover:bg-red-50`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Tip {currentTipIndex + 1} of {financialTips.length} • Updates daily
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTip;
