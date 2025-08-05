
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { useFinancial } from '../../contexts/FinancialContext';
import { toast } from '../../hooks/use-toast';
import { PiggyBank, Plus, Trash2, AlertTriangle } from 'lucide-react';

const BudgetOverview = () => {
  const { budgets, addBudget, deleteBudget } = useFinancial();
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    limit: '',
    period: 'monthly' as 'monthly' | 'weekly'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!budgetForm.category || !budgetForm.limit) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    addBudget({
      category: budgetForm.category,
      limit: parseFloat(budgetForm.limit),
      period: budgetForm.period,
    });

    toast({
      title: 'Success',
      description: 'Budget created successfully!',
    });

    setBudgetForm({
      category: '',
      limit: '',
      period: 'monthly'
    });
    setIsAddingBudget(false);
  };

  const handleDeleteBudget = (id: string) => {
    deleteBudget(id);
    toast({
      title: 'Budget deleted',
      description: 'Your budget has been removed.',
    });
  };

  const categories = [
    'Food', 'Transport', 'Entertainment', 'Shopping', 
    'Bills', 'Healthcare', 'Education', 'Travel', 'Other'
  ];

  return (
    <Card className="bg-white/80 max-h-56 overflow-y-auto backdrop-blur-sm border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-5 w-5 text-gray-900" />
            <span className='text-gray-900'>Budget Overview</span>
          </div>
          {!isAddingBudget && (
            <Button
              onClick={() => setIsAddingBudget(true)}
              size="sm"
              variant="outline"
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4 dark:text-white" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingBudget && (
          <form onSubmit={handleAddBudget} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Select
                value={budgetForm.category}
                onValueChange={(value) => setBudgetForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Budget limit"
                value={budgetForm.limit}
                onChange={(e) => setBudgetForm(prev => ({ ...prev, limit: e.target.value }))}
                required
              />
              <Select
                value={budgetForm.period}
                onValueChange={(value) => setBudgetForm(prev => ({ ...prev, period: value as 'monthly' | 'weekly' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" size="sm" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Create Budget
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddingBudget(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {budgets.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <PiggyBank className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No budgets set</p>
            <p className="text-sm">Create your first budget to track spending</p>
          </div>
        ) : (
          <div className="space-y-4 ">
            {budgets.map((budget) => {
              const utilizationRate = (budget.spent / budget.limit) * 100;
              const isOverBudget = utilizationRate > 100;
              const isNearLimit = utilizationRate > 80;
              
              return (
                <div key={budget.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                        <span>{budget.category}</span>
                        {isOverBudget && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)} • {budget.period}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-2">
                    <Progress 
                      value={Math.min(utilizationRate, 100)} 
                      className={`h-2 ${
                        isOverBudget 
                          ? '[&>div]:bg-red-500' 
                          : isNearLimit 
                          ? '[&>div]:bg-yellow-500' 
                          : '[&>div]:bg-green-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className={`font-medium ${
                      isOverBudget 
                        ? 'text-red-600' 
                        : isNearLimit 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    }`}>
                      {utilizationRate.toFixed(0)}% used
                    </span>
                    <span className="text-gray-500 dark:text-gray-300">
                      {formatCurrency(budget.limit - budget.spent)} remaining
                    </span>
                  </div>

                  {isOverBudget && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                      ⚠️ Over budget by {formatCurrency(budget.spent - budget.limit)}
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

export default BudgetOverview;
