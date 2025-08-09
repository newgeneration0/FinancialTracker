// // // src/hooks/useRecurringAutoTrigger.ts
// // import { useEffect } from 'react'
// // import { supabase } from '@/components/auth/SupabaseClient'
// // import { useAuth } from '@/contexts/AuthContext'
// // import { useFinancial } from '@/contexts/FinancialContext'
// // import { parseISO, isBefore, isEqual, startOfToday } from 'date-fns'
// // import { getNextDate } from '@/lib/getNextDate'


// // export const triggerRecurring = async (userId: string, addTransaction: Function) => {
// //   const today = startOfToday()

// //   const { data: recurs, error } = await supabase
// //     .from('recurring_transactions')
// //     .select('*')
// //     .eq('user_id', userId)
// //     .eq('is_active', true)

// //   if (error || !recurs) {
// //     console.error('Failed to fetch recurring transactions:', error)
// //     return
// //   }

// //   for (const recurring of recurs) {
// //     const nextDate = parseISO(recurring.next_occurrence)
// //     const dueToday = isBefore(nextDate, today) || isEqual(nextDate, today)

// //     if (dueToday) {
// //       // Add to transactions
// //       await addTransaction({
// //         type: recurring.type,
// //         amount: recurring.amount,
// //         category: recurring.category,
// //         description: `${recurring.description} (Auto)`,
// //         date: today.toISOString().split('T')[0],
// //       })

// //       // Update next_occurrence
// //       const updatedDate = getNextDate(recurring.frequency)

// //       await supabase
// //         .from('recurring_transactions')
// //         .update({ next_occurrence: updatedDate })
// //         .eq('id', recurring.id)
// //     }
// //   }

// //   // Mark this session as triggered
// //   sessionStorage.setItem('recurringTriggered', 'true')
// // }

// // // This runs once on login if not already triggered
// // export const useRecurringAutoTrigger = () => {
// //   const { user } = useAuth()
// //   const { addTransaction } = useFinancial()

// //   useEffect(() => {
// //     if (!user?.id) return

// //     const alreadyTriggered = sessionStorage.getItem('recurringTriggered')
// //     if (!alreadyTriggered) {
// //       triggerRecurring(user.id, addTransaction)
// //     }
// //   }, [user])
// // }


// import { useEffect } from 'react'
// import { supabase } from '@/components/auth/SupabaseClient'
// import { useAuth } from '@/contexts/AuthContext'
// import { useFinancial } from '@/contexts/FinancialContext'
// import { parseISO, isBefore, isEqual, startOfToday } from 'date-fns'
// import { getNextDate } from '@/lib/getNextDate'

// type AddTransaction = (tx: {
//   type: string
//   amount: number
//   category: string
//   description: string
//   date: string
// }) => Promise<void> | void

// export const triggerRecurring = async (
//   userId: string,
//   addTransaction: AddTransaction
// ) => {
//   const today = startOfToday()

//   const { data: recurs, error } = await supabase
//     .from('recurring_transactions')
//     .select('*')
//     .eq('user_id', userId)
//     .eq('is_active', true)

//   if (error || !recurs) {
//     console.error('Failed to fetch recurring transactions:', error)
//     return
//   }

//   for (const recurring of recurs) {
//     const nextDate = parseISO(recurring.next_occurrence)
//     const dueToday = isBefore(nextDate, today) || isEqual(nextDate, today)

//     if (dueToday) {
//       await addTransaction({
//         type: recurring.type,
//         amount: recurring.amount,
//         category: recurring.category,
//         description: `${recurring.description} (Auto)`,
//         date: today.toISOString().split('T')[0],
//       })

//       const updatedDate = getNextDate(recurring.frequency)

//       await supabase
//         .from('recurring_transactions')
//         .update({ next_occurrence: updatedDate })
//         .eq('id', recurring.id)
//     }
//   }

//   sessionStorage.setItem('recurringTriggered', 'true')
// }

// export const useRecurringAutoTrigger = () => {
//   const { user } = useAuth()
//   const { addTransaction } = useFinancial()

//   useEffect(() => {
//     if (!user?.id) return

//     const alreadyTriggered = sessionStorage.getItem('recurringTriggered')
//     if (!alreadyTriggered) {
//       triggerRecurring(user.id, addTransaction)
//     }
//   }, [user])
// }
