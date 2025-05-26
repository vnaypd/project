export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  purpose: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period?: 'weekly' | 'monthly' | 'yearly';
  alertThreshold?: number;
}

export interface Balance {
  total: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
}