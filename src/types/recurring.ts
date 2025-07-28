// src/types.ts or src/types/recurring.ts

// export interface RecurringTransaction {
//   id: string;
//   user_id: string;
//   amount: number;
//   category: string;
//   description: string,
//   type: 'income' | 'expense';
//   frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
//   next_occurrence: string; // or Date
//   isActive: boolean;
//   created_at: string;
// }

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

// // src/types.ts or src/types/recurring.ts

// export interface RecurringTransaction {
//   id: string;
//   user_id: string;
// //   name: string;
//   amount: number;
//   category: string;
//   description: string,
//   type: 'income' | 'expense';
//   frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
// //   start_date: string; // or Date if you convert it
// //   end_date: string | null;
//   next_occurrence: string; // or Date
//   isActive: boolean;
//   created_at: string;
// }
