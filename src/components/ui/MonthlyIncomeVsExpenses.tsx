import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { useMemo, useState } from 'react'
import { useFinancial } from '@/contexts/FinancialContext'
import { getMonthlySummary } from '@/types/getMonthlySummary'

const MonthlyIncomeVsExpenses = () => {
  const { transactions } = useFinancial()
  const [monthsBack, setMonthsBack] = useState(6)
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  const monthlyData = useMemo(
    () => getMonthlySummary(transactions, monthsBack),
    [transactions, monthsBack]
  )

  const ChartComponent = chartType === 'line' ? LineChart : BarChart
  const ChartIncome = chartType === 'line'
    ? <Line type="monotone" dataKey="income" stroke="#16a34a" name="Income" />
    : <Bar dataKey="income" fill="#16a34a" name="Income" />
  const ChartExpense = chartType === 'line'
    ? <Line type="monotone" dataKey="expense" stroke="#dc2626" name="Expenses" />
    : <Bar dataKey="expense" fill="#dc2626" name="Expenses" />

    const ChartNet = chartType === 'line'
  ? <Line type="monotone" dataKey="net" stroke="#0ea5e9" name="Net Savings" strokeDasharray="4 4" />
  : <Bar dataKey="net" fill="#0ea5e9" name="Net Savings" />

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={monthsBack}
          onChange={(e) => setMonthsBack(Number(e.target.value))}
          className="border rounded px-3 py-1 text-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={12}>Last 12 Months</option>
        </select>

        <button
          onClick={() =>
            setChartType((prev) => (prev === 'line' ? 'bar' : 'line'))
          }
          className="text-sm px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
        >
          Switch to {chartType === 'line' ? 'Bar' : 'Line'} Chart
        </button>
      </div>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(val) => `₦${val.toLocaleString()}`} />
            <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
            <Legend />
            {ChartIncome}
            {ChartExpense}
            {ChartNet}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MonthlyIncomeVsExpenses
