import { useEffect } from "react";
import { supabase } from "../components/auth/SupabaseClient";
import { toast } from "./use-toast";

export const useAutoRecurringTransactions = (user, addTransaction) => {
  useEffect(() => {
    const runRecurringTransactions = async () => {
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      // Fetch active recurring transactions for user
      const { data: recurringList, error } = await supabase
        .from("recurring_transactions")
        .select("*")
        .eq("is_active", true)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching recurring transactions:", error);
        return;
      }

      for (const recurring of recurringList) {
        const due =
          recurring.next_occurrence &&
          today >= recurring.next_occurrence &&
          recurring.last_run_date !== today; // Check server lock

        if (due) {
          // Calculate new next_occurrence date
          const nextDate = new Date(recurring.next_occurrence);
          switch (recurring.frequency) {
            case "daily":
              nextDate.setDate(nextDate.getDate() + 1);
              break;
            case "weekly":
              nextDate.setDate(nextDate.getDate() + 7);
              break;
            case "monthly":
              nextDate.setMonth(nextDate.getMonth() + 1);
              break;
            case "yearly":
              nextDate.setFullYear(nextDate.getFullYear() + 1);
              break;
          }

          // Update DB first: next_occurrence + last_run_date
          await supabase
            .from("recurring_transactions")
            .update({
              next_occurrence: nextDate.toISOString().split("T")[0],
              last_run_date: today,
            })
            .eq("id", recurring.id);

          // Then add the actual transaction
          await addTransaction({
            type: recurring.type,
            amount: recurring.amount,
            category: recurring.category,
            description: `${recurring.description} (Auto)`,
            date: today,
          });
          toast({
            title: recurring.type === "income" ? "Income Added" : "Expense Deducted",
            description: `${recurring.description} of ₦${recurring.amount} ${
                recurring.type === "income" ? "added" : "deducted"
            } automatically`,
            // status: recurring.type === "income" ? "success" : "error", // green for income, red for expense
            // duration: 5000,
            // isClosable: true,
            // position: "top-right",
            });

        //   console.log(`✅ Ran recurring: ${recurring.description}`);
        }
      }
    };

    runRecurringTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};
