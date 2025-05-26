import { Expense } from '../types';

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const options = {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  };

  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', options).format(amount);
  }
  return new Intl.NumberFormat('en-US', options).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const groupExpensesByCategory = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc: Record<string, number>, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});
};

export const getTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const filterExpensesByMonth = (expenses: Expense[], month: number, year: number): Expense[] => {
  return expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};