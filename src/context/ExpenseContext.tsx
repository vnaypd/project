import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Expense,
  Category,
  Budget,
  Balance,
  Transaction,
} from '../types';
import { generateId, formatCurrency } from '../utils/helpers';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';
import { auth } from '../utils/firebase';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  balance: Balance;
  currency: string;
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
  setCurrency: (currency: string) => void;
  resetAllData: () => void;
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
  const [currency, setCurrency] = useState('INR');
  const [dataLoaded, setDataLoaded] = useState(false);

  // Initialize Firebase listeners
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      // Load from localStorage if not authenticated
      const storedBalance = localStorage.getItem('balance');
      if (storedBalance) {
        const parsedBalance = JSON.parse(storedBalance);
        setBalance({
          total: parsedBalance.total || 0,
          transactions: Array.isArray(parsedBalance.transactions) ? parsedBalance.transactions : [],
        });
      }
      setDataLoaded(true);
      return;
    }

    const db = getDatabase();
    const balanceRef = ref(db, `users/${user.uid}/balance`);

    const unsubscribe = onValue(balanceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBalance({
          total: data.total || 0,
          transactions: Array.isArray(data.transactions) ? data.transactions : [],
        });
      }
      setDataLoaded(true);
    });

    return () => {
      off(balanceRef);
    };
  }, []);

  // Save balance changes
  useEffect(() => {
    if (!dataLoaded) return;

    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      set(ref(db, `users/${user.uid}/balance`), balance);
    } else {
      localStorage.setItem('balance', JSON.stringify(balance));
    }
  }, [balance, dataLoaded]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    setExpenses((prev) => [...prev, newExpense]);

    // Update balance
    setBalance((prev) => ({
      total: prev.total - expense.amount,
      transactions: [
        {
          id: generateId(),
          type: 'debit',
          amount: expense.amount,
          date: expense.date,
          description: expense.description,
        },
        ...prev.transactions,
      ],
    }));
  };

  const updateExpense = (updatedExpense: Expense) => {
    const oldExpense = expenses.find((e) => e.id === updatedExpense.id);
    if (oldExpense) {
      const difference = oldExpense.amount - updatedExpense.amount;
      setBalance((prev) => ({
        ...prev,
        total: prev.total + difference,
      }));
    }
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setBalance((prev) => ({
        ...prev,
        total: prev.total + expense.amount,
      }));
    }
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const addBalance = (amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: generateId(),
      type: 'credit',
      amount,
      date: new Date().toISOString(),
      description,
    };

    setBalance((prev) => ({
      total: prev.total + amount,
      transactions: [newTransaction, ...prev.transactions],
    }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: generateId() };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: generateId() };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
  };

  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setExpenses(initialExpenses);
      setCategories(initialCategories);
      setBudgets(initialBudgets);
      setBalance(initialBalance);
      setCurrency('INR');

      const user = auth.currentUser;
      if (user) {
        const db = getDatabase();
        set(ref(db, `users/${user.uid}`), null);
      }

      localStorage.clear();
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        budgets,
        balance,
        currency,
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
        setCurrency,
        resetAllData,
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