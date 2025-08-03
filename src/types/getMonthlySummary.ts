// utils/getMonthlySummary.ts
import { Transaction } from '@/contexts/FinancialContext'
import { parseISO, format, subMonths, isAfter } from 'date-fns'

export const getMonthlySummary = (
  transactions: Transaction[],
  monthsBack: number = 6
) => {
  const cutoffDate = subMonths(new Date(), monthsBack)
  const summary: Record<string, { income: number; expense: number; net: number }> = {}

  transactions.forEach((tx) => {
    const txDate = parseISO(tx.date)
    if (!isAfter(txDate, cutoffDate)) return

    const month = format(txDate, 'yyyy-MM')

    if (!summary[month]) {
      summary[month] = { income: 0, expense: 0, net: 0 }
    }

    if (tx.type === 'income') {
      summary[month].income += tx.amount
    } else if (tx.type === 'expense') {
      summary[month].expense += tx.amount
    }

    // Recalculate net after updating income/expense
    summary[month].net = summary[month].income - summary[month].expense
  })

  return Object.entries(summary)
    .map(([month, values]) => ({ month, ...values }))
    .sort((a, b) => a.month.localeCompare(b.month))
}
