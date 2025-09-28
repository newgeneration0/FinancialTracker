/// <reference lib="deno.ns" />
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
// import { createClient } from 'npm:@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client in the Edge Function
const supabase = createClient(
  Deno.env.get('VITE_SUPABASE_URL')!,
  Deno.env.get('VITE_SUPABASE_SERVICE_ROLE_KEY')! // service role to allow DB writes
)

Deno.serve(async (req) => {
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    // 1️⃣ Get active recurring transactions that are due today or earlier
    const { data: recurringList, error: fetchError } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('is_active', true)
      .lte('next_occurrence', today)

    if (fetchError) throw fetchError
    if (!recurringList || recurringList.length === 0) {
      return new Response(JSON.stringify({ message: 'No transactions due today' }), { status: 200 })
    }

    for (const r of recurringList) {
      // 2️⃣ Insert into transactions table
      const { error: insertError } = await supabase.from('transactions').insert([{
        type: r.type,
        amount: r.amount,
        category: r.category,
        description: r.description,
        date: today,
      }])

      if (insertError) throw insertError

      // 3️⃣ Calculate next_occurrence based on frequency
      const nextDate = new Date(today)
      switch (r.frequency) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1)
          break
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7)
          break
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1)
          break
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1)
          break
      }

      // 4️⃣ Update recurring transaction with new next_occurrence
      const { error: updateError } = await supabase
        .from('recurring_transactions')
        .update({ next_occurrence: nextDate.toISOString().split('T')[0] })
        .eq('id', r.id)

      if (updateError) throw updateError
    }

    return new Response(JSON.stringify({ message: 'Recurring transactions processed' }), { status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
