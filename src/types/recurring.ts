export interface RecurringTransaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_occurrence: string;
  is_active: boolean;
  created_at: string;
}

