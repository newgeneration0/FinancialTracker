import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  parseISO,
  format,
} from 'date-fns';

// export function getNextDate(frequency: string, fromDate: string) {
//   const base = parseISO(fromDate);

//   switch (frequency) {
//     case 'daily':
//       return format(addDays(base, 1), 'yyyy-MM-dd');
//     case 'weekly':
//       return format(addWeeks(base, 1), 'yyyy-MM-dd');
//     case 'monthly':
//       return format(addMonths(base, 1), 'yyyy-MM-dd');
//     case 'yearly':
//       return format(addYears(base, 1), 'yyyy-MM-dd');
//     default:
//       return format(base, 'yyyy-MM-dd');
//   }
// }

export const getNextDate = (frequency: string, fromDate: Date = new Date()): string => {
  const next = new Date(fromDate);

  if (frequency === 'daily') {
    next.setDate(next.getDate() + 1);
  } else if (frequency === 'weekly') {
    next.setDate(next.getDate() + 7);
  } else if (frequency === 'yearly') {
    next.setFullYear(next.getFullYear() + 1);
  }

  return next.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

