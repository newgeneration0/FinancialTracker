import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useFinancial } from '../../contexts/FinancialContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from '../../hooks/use-toast';
import { RecurringTransaction } from 'src/types/recurring';
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../auth/SupabaseClient';
import { SendNotification } from '@/lib/SendNotification';
import { 
  Plus, 
  Calendar, 
  Repeat, 
  Trash2,
  Play,
  Pause,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const RecurringTransactions = () => {
  const { addTransaction } = useFinancial();
  const { formatCurrency } = useCurrency();
  const { user } = useAuth()
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
  });

  const categories = [
    'Food & Dining', 'Transport', 'Entertainment', 'Shopping',
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
    'Salary', 'Freelance', 'Investment', 'Business', 'Other'
  ];

  const getNextDate = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'yearly':
        now.setFullYear(now.getFullYear() + 1);
        break;
    }
    return now.toISOString().split('T')[0];
  };

    useEffect(() => {
    const fetchRecurring = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: 'Error loading transactions',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setRecurringTransactions(data);
      }
    };

    fetchRecurring();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.amount || !formData.category || !formData.description) {
    toast({
      title: 'Error',
      description: 'Please fill in all fields.',
      variant: 'destructive',
    });
    return;
  }

  // Only include fields that exist in your Supabase `recurring_transactions` table
  const newRecurring = {
    type: formData.type as 'income' | 'expense',
    amount: parseFloat(formData.amount),
    category: formData.category,
    description: formData.description,
    frequency: formData.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
    next_occurrence: getNextDate(formData.frequency),
    is_active: true,
    user_id: user?.id || '',
    created_at: new Date().toISOString(),
  };
  console.log("User ID being sent:", user?.id);


  const { data, error } = await supabase
    .from('recurring_transactions')
    .insert([newRecurring])
    .select();

  if (error) {
    toast({
      title: 'Failed to save',
      description: error.message,
      variant: 'destructive',
    });
    return;
  }

  if (data) {
    setRecurringTransactions((prev) => [...prev, data[0]]);
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      frequency: 'monthly',
    });
    setShowForm(false);

    toast({
      title: 'Recurring transaction created',
      description: `${formData.frequency} ${formData.type} of ${formatCurrency(parseFloat(formData.amount))} has been saved.`,
    });
  }
};


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.amount || !formData.category || !formData.description) {
//       toast({
//         title: 'Error',
//         description: 'Please fill in all fields.',
//         variant: 'destructive',
//       });
//       return;
//     }

//      const newRecurring: Omit<RecurringTransaction, 'id'> = {
//       type: formData.type as 'income' | 'expense',
//       amount: parseFloat(formData.amount),
//       category: formData.category,
//       description: formData.description,
//       frequency: formData.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
//       next_occurrence: getNextDate(formData.frequency),
//       isActive: true,
//       user_id: user?.id || '',
//       created_at: new Date().toISOString(),
//     };

//      const { data, error } = await supabase
//       .from('recurring_transactions')
//       .insert([newRecurring])
//       .select();

//     if (error) {
//       toast({
//         title: 'Failed to save',
//         description: error.message,
//         variant: 'destructive',
//       });
//       return;
//     }

//     if (data) {
//       setRecurringTransactions((prev) => [...prev, data[0]]);
//       setFormData({
//         type: 'expense',
//         amount: '',
//         category: '',
//         description: '',
//         frequency: 'monthly',
//       });
//       setShowForm(false);

//       toast({
//         title: 'Recurring transaction created',
//         description: `${formData.frequency} ${formData.type} of ${formatCurrency(parseFloat(formData.amount))} has been saved.`,
//       });
//     }

//     toast({
//       title: 'Recurring transaction created',
//       description: `${formData.frequency} ${formData.type} of ${formatCurrency(parseFloat(formData.amount))} has been set up.`,
//     });
//   };


  const executeTransaction = async (recurring: RecurringTransaction) => {
  // Add the actual transaction
  await addTransaction({
    type: recurring.type,
    amount: recurring.amount,
    category: recurring.category,
    description: `${recurring.description} (Auto)`,
    date: new Date().toISOString().split('T')[0],
  });

  // Update the next execution date and mark as executed
  setRecurringTransactions(prev =>
    prev.map(r =>
      r.id === recurring.id
        ? {
            ...r,
            nextDate: getNextDate(r.frequency),
            lastExecuted: new Date().toISOString().split('T')[0],
          }
        : r
    )
  );

  //Send notification
  await SendNotification({
    userId: user!.id, // make sure user is available in scope
    title: 'Recurring Payment Processed',
    message: `₦${recurring.amount.toLocaleString()} deducted for "${recurring.description}" (${recurring.frequency}).`,
    type: 'recurring',
  });

  // show toast
  toast({
    title: "Transaction added",
    description: `${recurring.description} executed as one-time transaction.`,
    });
  };

    const toggleActive = async (id: string, currentStatus: boolean) => {
  // Update in Supabase
  const { error } = await supabase
    .from('recurring_transactions')
    .update({ is_active: !currentStatus })
    .eq('id', id);

  if (error) {
    toast({
      title: 'Failed to update status',
      description: error.message,
      variant: 'destructive',
    });
    return;
  }

  // Update local state
  setRecurringTransactions(prev => 
    prev.map(r => 
      r.id === id ? { ...r, is_active: !currentStatus } : r
    )
  );

  toast({
    title: `Recurring transaction ${!currentStatus ? 'resumed' : 'paused'}`,
    description: `This recurring transaction is now ${!currentStatus ? 'active' : 'inactive'}.`,
  });
};


    // const toggleActive = (id: string) => {
    // setRecurringTransactions(prev => prev.map(r => 
    //     r.id === id ? { ...r, isActive: !r.is_active } : r
    // ));
    // };

    // const deleteRecurring = (id: string) => {
    // setRecurringTransactions(prev => prev.filter(r => r.id !== id));
    // toast({
    //     title: 'Recurring transaction deleted',
    //     description: 'The recurring transaction has been removed.',
    // });
    // };

    const deleteRecurring = async (id: string) => {
      const { error } = await supabase
      .from('recurring_transactions')
      .delete()
      .eq('id', id);

      if (error) {
          toast({
          title: 'Delete failed',
          description: error.message,
          variant: 'destructive'
          });
          return;
      }

      // Update UI
      setRecurringTransactions(prev => prev.filter(tx => tx.id !== id));

      toast({
          title: 'Deleted',
          description: 'The Recurring transaction has been removed.',
      });
    };


  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-md">
        {/* <CardHeader>
          <CardTitle className="block md:flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Repeat className="h-5 w-5" />
              <span>Recurring Transactions</span>
            </div>
            <Button onClick={() => setShowForm(!showForm)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Recurring
            </Button>
          </CardTitle>
        </CardHeader> */}
        <CardHeader>
          <CardTitle className="flex flex-col md:flex-row items-center md:items-start justify-between gap-2">
            {/* Left side: Icon + text */}
            <div className="flex items-center space-x-2 justify-center md:justify-start w-full md:w-auto">
              <Repeat className="h-5 w-5" />
              <span className='text-xl lg:text-2xl'>Recurring Transactions</span>
            </div>

            {/* Right side: Button */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <Button onClick={() => setShowForm(!showForm)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Recurring
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => 
                        setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => 
                        setFormData({...formData, category: value})}>
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

                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={formData.frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => 
                        setFormData({...formData, frequency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit">Create Recurring Transaction</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Recurring Transactions List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recurringTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Repeat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No recurring transactions</p>
                <p className="text-sm">Set up automatic income or expense transactions</p>
              </div>
            ) : (
              recurringTransactions.map((recurring) => (
                <div
                key={recurring.id}
                className={`flex flex-col md:flex-row md:items-center sm:justify-between p-4 rounded-lg border gap-3 transition-colors
                  
                   ${
                  recurring.is_active
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 opacity-60'
                }`}
              >
                {/* LEFT: Icon + Info */}
                <div className="flex flex-row sm:flex-row sm:items-start space-x-3">
                  <div
                    className={`p-2 rounded-full self-start sm:self-auto ${
                      recurring.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {recurring.type === 'income' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="mt-0 sm:mt-0">
                    <p className="font-medium text-sm sm:text-base break-words">{recurring.description}</p>
                    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-muted-foreground">
                      <span>{recurring.category}</span>
                      <span>•</span>
                      <span className="capitalize">{recurring.frequency}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className="truncate">Next: {new Date(recurring.next_occurrence).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Amount + Actions */}
                <div className="flex flex-row items-start ms-10 md:ms-0 sm:items-center justify-between gap-1 sm:gap-4">
                  <span
                    className={`font-semibold ${
                      recurring.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {recurring.type === 'income' ? '+' : '-'}
                    {formatCurrency(recurring.amount)}
                  </span>

                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => executeTransaction(recurring)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      disabled={!recurring.is_active}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(recurring.id, recurring.is_active)}
                      className={
                        recurring.is_active
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-green-600 hover:bg-green-50'
                      }
                    >
                      {recurring.is_active ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecurring(recurring.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringTransactions;
