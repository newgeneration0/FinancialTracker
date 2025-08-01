
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../components/auth/supabaseClient'
// import { faker } from '@faker-js/faker';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
}

interface FinancialContextType {
  transactions: Transaction[];
  goals: SavingsGoal[];
  budgets: Budget[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  fetchGoals: () => void;
  updateGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  fetchBudgets : (id: string) => void;
  recalculateBudgets : (id: string) => void;
  // createFakeLastMonthTransactions: (user_id: string, count?: number) => Promise<void>~
 calculateMonthlyChange: (type: 'income' | 'expense' | 'balance') => number | null;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { user } = useAuth();

//   useEffect(() => {
//   if (user) {
//     createFakeLastMonthTransactions(user.id, 10); // Creates 10 fake last month transactions
//   }
// }, [user]);


  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError.message);
      } else {
        setTransactions(transactionData || []);
      }

      fetchBudgets();

    };

    fetchData();
  }, [user]);

   //to run recalculateBudgets whenever transactions or budgets change
  useEffect(() => {
    if (!transactions.length || !budgets.length) return;

    const updatedBudgets = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });

    // Only update if there's a real difference
    const isChanged = updatedBudgets.some((b, i) => b.spent !== budgets[i].spent);

    if (isChanged) {
      setBudgets(updatedBudgets);
    }
  }, [transactions, budgets]);


  // Save data to localStorage whenever state changes
  useEffect(() => {
    const data = {
      transactions,
      goals,
      budgets
    };
    localStorage.setItem('financialData', JSON.stringify(data));
  }, [transactions, goals, budgets]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  //fake



  {/** TRANSACTIONS SECTION */}
  // ADD TRANSACTION
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        { ...transaction, user_id: user?.id }
      ])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error.message);
      return;
    }

    setTransactions(prev => [data, ...prev]);

   // If it's an expense, update the corresponding budget
    if (data.type === 'expense') {
      const matchedBudget = budgets.find(b => b.category === data.category);
      if (matchedBudget) {
        const newSpent = matchedBudget.spent + data.amount;
        updateBudget(matchedBudget.id, { spent: newSpent });
      }
    }
  };

  //DELETE TRANSACTION
  const deleteTransaction = async (id: string) => {
  // Find the transaction first
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;

  // Delete from Supabase
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error.message);
      return;
    }

    // Update budgets if it was an expense
    if (transaction.type === 'expense') {
      setBudgets(prev => prev.map(budget =>
        budget.category === transaction.category
          ? { ...budget, spent: Math.max(0, budget.spent - transaction.amount) }
          : budget
      ));
    }
    // Update local state
    setTransactions(prev => prev.filter(t => t.id !== id));
  };


  //fake fake
//   const createFakeLastMonthTransactions = async (user_id: string, count = 5) => {
//   const lastMonth = new Date();
//   lastMonth.setMonth(lastMonth.getMonth() - 1);

//   const fakeTransactions =  Array.from({ length: count }, (_, i) => ({
//     id: crypto.randomUUID(),
//     user_id,
//     // name: `Fake Transaction ${i + 1}`,
//     amount: Math.floor(Math.random() * 5000) + 1000,
//     type: Math.random() > 0.5 ? 'income' : 'expense',
//     category: faker.commerce.department(),
//     created_at: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString(),
//   }));

//   const { error } = await supabase.from('transactions').insert(fakeTransactions);
//   if (error) console.error('Error creating fake transactions:', error.message);
//   else console.log(`✅ Created ${count} fake transactions from last month.`);
// };



  {/** GOALS SECTION */}
  const addGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
    const {
      name,
      targetAmount,
      targetDate,
      category,
      currentAmount
    } = goal;

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.from('savings_goals').insert([
      {
        user_id: user.id,
        name,
        target_amount: targetAmount,
        target_date: targetDate,
        category,
        current_amount: currentAmount ?? 0,
      }
    ]).select(); // select() returns the inserted row

    if (error) {
      throw new Error(error.message);
    }

    const newGoalFromSupabase = {
      id: data[0].id,
      name: data[0].name,
      targetAmount: data[0].target_amount,
      targetDate: data[0].target_date,
      currentAmount: data[0].current_amount,
      category: data[0].category,
    };

    setGoals(prev => [...prev, newGoalFromSupabase]);
  };



  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error.message);
      return;
    }

    if (data) {
      const cleanedGoals = data
        .map(goal => {
          const targetAmount = parseFloat(goal.target_amount);
          const currentAmount = parseFloat(goal.current_amount);

          // Check for valid numbers
          if (isNaN(targetAmount) || isNaN(currentAmount)) {
            console.warn("Invalid amount, skipping:", goal);
            return null;
          }

          // Validate and convert targetDate
          const isValidDate = goal.target_date && !isNaN(Date.parse(goal.target_date));
          if (!isValidDate) {
            console.warn("Invalid or missing targetDate, skipping:", goal);
            return null;
          }

          return {
            id: goal.id,
            name: goal.name,
            targetAmount,
            currentAmount,
            targetDate: new Date(goal.target_date).toISOString(),
            category: goal.category || 'savings', // fallback
            user_id: goal.user_id,
            is_completed: currentAmount >= targetAmount,
          };
        })
        .filter(Boolean); // removes any nulls

      setGoals(cleanedGoals);
    }
  };


  const updateGoal = async (id: string, amount: number) => {
    // Find the existing goal
    const goalToUpdate = goals.find(goal => goal.id === id);
    if (!goalToUpdate) return;

    const newAmount = Math.min(goalToUpdate.targetAmount, goalToUpdate.currentAmount + amount);

    // Update in Supabase
    const { error } = await supabase
      .from('savings_goals')
      .update({ current_amount: newAmount })
      .eq('id', id);

    if (error) {
      console.error('Failed to update goal in Supabase:', error.message);
      return;
    }

    // Update in local state
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id
          ? { ...goal, currentAmount: newAmount }
          : goal
      )
    );
  };


  const deleteGoal = async (id: string) => {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting goal from Supabase:', error.message);
      return;
    }

    // Update local state
    setGoals(prev => prev.filter(g => g.id !== id));
  };


  {/** BUDGETS SECTION */}
  // ADD BUDGET
  const addBudget = async (budget) => {
    const { error } = await supabase.from('budgets').insert([
      { ...budget, user_id: user.id }
    ]);
    if (error) console.error(error);
    else fetchBudgets(); // Refresh list
  };

  // UPDATE BUDGET
  const updateBudget = async (id: string, updatedBudget: Partial<Budget>) => {
    const { data, error } = await supabase
      .from('budgets')
      .update(updatedBudget)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating budget:', error.message);
      return;
    }

    // Update local state
    setBudgets(prev =>
      prev.map(budget => (budget.id === id ? { ...budget, ...data } : budget))
    );
  };

  // FETCH BUDGET
  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id);

    if (error) console.error(error);
    else setBudgets(data);
  };

  // DELETE BUDGET
  const deleteBudget = async (id) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (error) console.error(error);
    else fetchBudgets();
  };

  const recalculateBudgets = () => {
    if (!transactions.length || !budgets.length) return;

    const updatedBudgets = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);

      return { ...budget, spent };
    });

    setBudgets(updatedBudgets);
  };

  // const calculateMonthlyChange = (transactions: Transaction[]) => {
  //   const now = new Date();
  //   const thisMonth = now.getMonth();
  //   const lastMonth = (thisMonth - 1 + 12) % 12;
  //   const thisYear = now.getFullYear();
  //   const lastMonthYear = lastMonth === 11 ? thisYear - 1 : thisYear;

  //   const thisMonthTotal = transactions
  //     .filter((tx) => {
  //       const txDate = new Date(tx.date);
  //       return txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear;
  //     })
  //     .reduce((sum, tx) => sum + tx.amount, 0);

  //   const lastMonthTotal = transactions
  //     .filter((tx) => {
  //       const txDate = new Date(tx.date);
  //       return txDate.getMonth() === lastMonth && txDate.getFullYear() === lastMonthYear;
  //     })
  //     .reduce((sum, tx) => sum + tx.amount, 0);

  //   if (lastMonthTotal === 0) return null;

  //   const change = ((thisMonthTotal - lastMonthTotal) / Math.abs(lastMonthTotal)) * 100;
  //   return Math.round(change);
  // };


  const calculateMonthlyChange = (type: 'income' | 'expense' | 'balance') => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let thisMonthTotal = 0;
  let lastMonthTotal = 0;

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const year = date.getFullYear();

    if (type === 'income' && transaction.type === 'income') {
      if (month === currentMonth && year === currentYear) {
        thisMonthTotal += transaction.amount;
      } else if (month === lastMonth && year === lastMonthYear) {
        lastMonthTotal += transaction.amount;
      }
    } else if (type === 'expense' && transaction.type === 'expense') {
      if (month === currentMonth && year === currentYear) {
        thisMonthTotal += transaction.amount;
      } else if (month === lastMonth && year === lastMonthYear) {
        lastMonthTotal += transaction.amount;
      }
    }
  });

  if (type === 'balance') {
    thisMonthTotal = totalIncome - totalExpenses;
    // Calculate last month's balance manually if needed
    const thisMonth = new Date();
    const lastMonthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);
    const lastMonthEnd = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 0);

    lastMonthTotal = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return date >= lastMonthStart && date <= lastMonthEnd;
      })
      .reduce((acc, t) => {
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
      }, 0);
  }

  if (lastMonthTotal === 0) return null;

  const change = ((thisMonthTotal - lastMonthTotal) / Math.abs(lastMonthTotal)) * 100;
  return change;
};


  return (
    <FinancialContext.Provider value={{
      transactions,
      goals,
      budgets,
      totalIncome,
      totalExpenses,
      balance,
      addTransaction,
      deleteTransaction,
      addGoal,
      fetchGoals,
      updateGoal,
      deleteGoal,
      addBudget,
      updateBudget,
      deleteBudget,
      fetchBudgets,
      recalculateBudgets,
      calculateMonthlyChange,
      // createFakeLastMonthTransactions
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
