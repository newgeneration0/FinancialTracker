
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useFinancial } from '../../contexts/FinancialContext';
import { toast } from '../../hooks/use-toast';
import { Plus, Minus, Target, Calculator } from 'lucide-react';

const QuickActions = () => {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
  });
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: 'savings',
  });

  const { addTransaction, addGoal } = useFinancial();

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
    expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'],
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionForm.amount || !transactionForm.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    addTransaction({
      ...transactionForm,
      amount: parseFloat(transactionForm.amount),
      date: new Date().toISOString().split('T')[0],
    });

    toast({
      title: 'Success',
      description: `${transactionForm.type === 'income' ? 'Income' : 'Expense'} added successfully!`,
    });

    setTransactionForm({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
    });
    setIsAddingTransaction(false);
  };

  // const handleAddGoal = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!goalForm.name || !goalForm.targetAmount || !goalForm.targetDate) {
  //     toast({
  //       title: 'Error',
  //       description: 'Please fill in all required fields.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   addGoal({
  //     ...goalForm,
  //     targetAmount: parseFloat(goalForm.targetAmount),
  //     currentAmount: 0,
  //   });

  //   toast({
  //     title: 'Success',
  //     description: 'Savings goal created successfully!',
  //   });

  //   setGoalForm({
  //     name: '',
  //     targetAmount: '',
  //     targetDate: '',
  //     category: 'savings',
  //   });
  //   setIsAddingGoal(false);
  // };

  const handleAddGoal = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!goalForm.name || !goalForm.targetAmount || !goalForm.targetDate) {
    toast({
      title: 'Error',
      description: 'Please fill in all required fields.',
      variant: 'destructive',
    });
    return;
  }

  try {
    await addGoal({
      name: goalForm.name,
      targetAmount: parseFloat(goalForm.targetAmount),
      targetDate: goalForm.targetDate,
      category: goalForm.category || 'savings', // or default value
      currentAmount: 0,
    });


    toast({
      title: 'Success',
      description: 'Savings goal created successfully!',
    });

    setGoalForm({
      name: '',
      targetAmount: '',
      targetDate: '',
      category: 'savings',
    });
    setIsAddingGoal(false);
  } catch (err: unknown) {
    if (err instanceof Error) {
    toast({
      title: 'Error creating goal',
      description: err.message || 'Something went wrong.',
      variant: 'destructive',
    });
  } else {
    toast({
      title: 'Error creating goal',
      description: 'Something went wrong.',
      variant: 'destructive',
    });
  }
}
};


  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-gray-900" />
          <span className="text-gray-900">Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAddingTransaction && !isAddingGoal && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => setIsAddingTransaction(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Income</span>
            </Button>
            <Button
              onClick={() => {
                setIsAddingTransaction(true);
                setTransactionForm(prev => ({ ...prev, type: 'expense' }));
              }}
              variant="outline"
              // className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50"
              className='flex items-center space-x-2 border-red-200 text-red-600 dark:hover:text-red-800 bg-gray-100 dark:hover:bg-gray-200'
            >
              <Minus className="h-4 w-4" />
              <span>Add Expense</span>
            </Button>
            <Button
              onClick={() => setIsAddingGoal(true)}
              variant="outline"
              className="flex items-center space-x-2 border-blue-200 text-blue-600 hover:text-blue-800 hover:bg-blue-50 sm:col-span-2 bg-gray-100"
            >
              <Target className="h-4 w-4" />
              <span>Create Savings Goal</span>
            </Button>
          </div>
        )}

        {isAddingTransaction && (
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="flex space-x-2">
              {(['income', 'expense'] as const).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={transactionForm.type === type ? 'default' : 'outline'}
                  onClick={() => setTransactionForm(prev => ({ ...prev, type }))}
                  className={`flex-1 ${
                    type === 'income' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {type === 'income' ? <Plus className="h-4 w-4 mr-2" /> : <Minus className="h-4 w-4 mr-2" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={transactionForm.category}
                  onValueChange={(value) => setTransactionForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[transactionForm.type].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Enter description..."
                value={transactionForm.description}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Add {transactionForm.type}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingTransaction(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {isAddingGoal && (
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                placeholder="e.g., Emergency Fund"
                value={goalForm.name}
                onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="5000.00"
                  value={goalForm.targetAmount}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, targetAmount: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Create Goal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingGoal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
