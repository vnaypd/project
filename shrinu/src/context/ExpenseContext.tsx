import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, Category, Budget, Balance, Transaction } from '../types';
import { generateId } from '../utils/helpers';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  balance: Balance;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addBalance: (amount: number, description: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const initialCategories: Category[] = [
  { id: '1', name: 'Food', color: '#EF4444' },
  { id: '2', name: 'Transportation', color: '#3B82F6' },
  { id: '3', name: 'Entertainment', color: '#F59E0B' },
  { id: '4', name: 'Housing', color: '#10B981' },
  { id: '5', name: 'Utilities', color: '#8B5CF6' },
  { id: '6', name: 'Other', color: '#6B7280' },
];

const initialExpenses: Expense[] = [];

const initialBudgets: Budget[] = [];

const initialBalance: Balance = {
  total: 0,
  transactions: [],
};

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [balance, setBalance] = useState<Balance>(initialBalance);

  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    const storedCategories = localStorage.getItem('categories');
    const storedBudgets = localStorage.getItem('budgets');
    const storedBalance = localStorage.getItem('balance');

    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
    if (storedBalance) setBalance(JSON.parse(storedBalance));
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('balance', JSON.stringify(balance));
  }, [expenses, categories, budgets, balance]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    setExpenses([...expenses, newExpense]);
    
    // Deduct expense from balance
    setBalance(prev => ({
      total: prev.total - expense.amount,
      transactions: [
        {
          id: generateId(),
          type: 'debit',
          amount: expense.amount,
          date: expense.date,
          description: expense.description
        },
        ...prev.transactions
      ]
    }));
  };

  const updateExpense = (updatedExpense: Expense) => {
    const oldExpense = expenses.find(e => e.id === updatedExpense.id);
    if (oldExpense) {
      // Adjust balance based on the difference
      const difference = oldExpense.amount - updatedExpense.amount;
      setBalance(prev => ({
        ...prev,
        total: prev.total + difference
      }));
    }
    
    setExpenses(expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      // Add the amount back to balance when deleting expense
      setBalance(prev => ({
        ...prev,
        total: prev.total + expense.amount
      }));
    }
    
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addBalance = (amount: number, description: string) => {
    setBalance(prev => ({
      total: prev.total + amount,
      transactions: [
        {
          id: generateId(),
          type: 'credit',
          amount,
          date: new Date().toISOString(),
          description
        },
        ...prev.transactions
      ]
    }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: generateId() };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: generateId() };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(budgets.map(budget => 
      budget.id === updatedBudget.id ? updatedBudget : budget
    ));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        budgets,
        balance,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        addBalance,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};