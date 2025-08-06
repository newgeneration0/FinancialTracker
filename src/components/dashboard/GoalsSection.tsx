
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { useFinancial } from '../../contexts/FinancialContext';
import { toast } from '../../hooks/use-toast';
import { Target, Plus, Trash2, Trophy, Calendar } from 'lucide-react';

interface GoalsSectionProps {
  detailed?: boolean;
}

const GoalsSection = ({ detailed = false }: GoalsSectionProps) => {
  const { goals, updateGoal, deleteGoal, fetchGoals } = useFinancial();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');

  

useEffect(() => {
  fetchGoals();
}, [fetchGoals]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleContribution = (goalId: string) => {
    const amount = parseFloat(contributionAmount);
    if (amount > 0) {
      updateGoal(goalId, amount);
      toast({
        title: 'Contribution added!',
        description: `${formatCurrency(amount)} added to your goal.`,
      });
      setContributionAmount('');
      setSelectedGoal(null);
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
    toast({
      title: 'Goal deleted',
      description: 'Your savings goal has been removed.',
    });
  };

  return (
    <Card className="bg-white/80 max-h-64 overflow-y-auto backdrop-blur-sm border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-gray-900" />
          <span className='text-gray-900'>Savings Goals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-500" />
            <p className="font-medium text-gray-900">No savings goals yet</p>
            <p className="text-sm text-gray-900">Create your first goal to start saving!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysRemaining = getDaysRemaining(goal.targetDate);
              const isCompleted = progress >= 100;
              
              return (
                <div key={goal.id} className="px-1 py-4 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-3 space-x-">
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{goal.name}</span>
                        {isCompleted && <Trophy className="h-4 w-4 text-yellow-500" />}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                  </div>

                  <div className="mb-3">
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>{Math.round(progress)}% complete</span>
                      <span>{formatCurrency(goal.targetAmount - goal.currentAmount)} remaining</span>
                    </div>
                  </div>

                  {!isCompleted && (
                    <div className="flex items-center space-x-2">
                      {selectedGoal === goal.id ? (
                        <>
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleContribution(goal.id)}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedGoal(null);
                              setContributionAmount('');
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedGoal(goal.id)}
                          className="flex items-center space-x-2 w-full justify-center border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Contribution</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsSection;
