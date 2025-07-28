
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../components/auth/supabaseClient'

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
  updateGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  fetchBudgets : (id: string) => void;
  recalculateBudgets : (id: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { user } = useAuth();


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

       // also update budgets from Supabase
      //  await fetchBudgets();
      fetchBudgets();

      // Fetch savings goals
      // const { data: goalData, error: goalError } = await supabase
      //   .from('savings_goals')
      //   .select('*')
      //   .eq('user_id', user.id);

      // if (goalError) {
      //   console.error('Error fetching goals:', goalError.message);
      // } else {
      //   setGoals(goalData || []);
      // }

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


  {/** GOALS SECTION */}
  const addGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

//   const addGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
//   const { data, error } = await supabase
//     .from('savings_goals')
//     .insert([{ ...goal, user_id: user?.id }])
//     .select()
//     .single();

//   if (error) {
//     console.error('Error adding goal:', error.message);
//     return;
//   }

//   // setGoals(prev => [...prev, data]);
//   setGoals(prev => [...prev, data]);
// };


  const updateGoal = (id: string, amount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: Math.min(goal.targetAmount, goal.currentAmount + amount) }
        : goal
    ));
  };

  const deleteGoal = (id: string) => {
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
      updateGoal,
      deleteGoal,
      addBudget,
      updateBudget,
      deleteBudget,
      fetchBudgets,
      recalculateBudgets,
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
