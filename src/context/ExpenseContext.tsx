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

  useEffect(() => {
    formatCurrency(0, currency);
  }, [currency]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const db = getDatabase();
        const userId = user.uid;

        const expensesRef = ref(db, `users/${userId}/expenses`);
        const categoriesRef = ref(db, `users/${userId}/categories`);
        const budgetsRef = ref(db, `users/${userId}/budgets`);
        const balanceRef = ref(db, `users/${userId}/balance`);
        const currencyRef = ref(db, `users/${userId}/currency`);

        const unsubscribeFns: (() => void)[] = [];

        onValue(expensesRef, (snapshot) => {
          const data = snapshot.val();
          setExpenses(data ? Object.values(data) : []);
        });

        onValue(categoriesRef, (snapshot) => {
          const data = snapshot.val();
          setCategories(data ? Object.values(data) : initialCategories);
        });

        onValue(budgetsRef, (snapshot) => {
          const data = snapshot.val();
          setBudgets(data ? Object.values(data) : []);
        });

        onValue(balanceRef, (snapshot) => {
          const data = snapshot.val();
          setBalance(
            data
              ? {
                total: data.total ?? 0,
                transactions: Array.isArray(data.transactions)
                  ? data.transactions
                  : [],
              }
              : initialBalance
          );
        });

        onValue(currencyRef, (snapshot) => {
          const data = snapshot.val();
          setCurrency(data || 'INR');
        });

        // Delay to allow data to load before saving anything
        const timeoutId = setTimeout(() => setDataLoaded(true), 1000);

        return () => {
          clearTimeout(timeoutId);
          off(expensesRef);
          off(categoriesRef);
          off(budgetsRef);
          off(balanceRef);
          off(currencyRef);
        };
      } else {
        const storedExpenses = localStorage.getItem('expenses');
        const storedCategories = localStorage.getItem('categories');
        const storedBudgets = localStorage.getItem('budgets');
        const storedBalance = localStorage.getItem('balance');
        const storedCurrency = localStorage.getItem('currency');

        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
        if (storedCategories) setCategories(JSON.parse(storedCategories));
        if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
        if (storedBalance) {
          const parsed = JSON.parse(storedBalance);
          setBalance({
            total: parsed.total ?? 0,
            transactions: Array.isArray(parsed.transactions)
              ? parsed.transactions
              : [],
          });
        }
        if (storedCurrency) setCurrency(storedCurrency);

        setDataLoaded(true);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;

    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      set(ref(db, `users/${user.uid}/expenses`), expenses);
      set(ref(db, `users/${user.uid}/categories`), categories);
      set(ref(db, `users/${user.uid}/budgets`), budgets);
      set(ref(db, `users/${user.uid}/balance`), balance);
      set(ref(db, `users/${user.uid}/currency`), currency);
    } else {
      localStorage.setItem('expenses', JSON.stringify(expenses));
      localStorage.setItem('categories', JSON.stringify(categories));
      localStorage.setItem('budgets', JSON.stringify(budgets));
      localStorage.setItem('balance', JSON.stringify(balance));
      localStorage.setItem('currency', currency);
    }
  }, [expenses, categories, budgets, balance, currency, dataLoaded]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    setExpenses([...expenses, newExpense]);
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
        ...(prev.transactions ?? []),
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
    setExpenses(
      expenses.map((expense) =>
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
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const addBalance = (amount: number, description: string) => {
    setBalance((prev) => ({
      total: prev.total + amount,
      transactions: [
        {
          id: generateId(),
          type: 'credit',
          amount,
          date: new Date().toISOString(),
          description,
        },
        ...(prev.transactions ?? []),
      ],
    }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: generateId() };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setBudgets(budgets.filter((budget) => budget.category !== id));
    setCategories(categories.filter((category) => category.id !== id));
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: generateId() };
    setBudgets([...budgets, newBudget]);
    const user = auth.currentUser;
    if (user) {
      try {
        const db = getDatabase();
        await set(ref(db, `users/${user.uid}/budgets/${newBudget.id}`), newBudget);
      } catch (error) {
        console.error('Failed to save budget to Firebase:', error);
        localStorage.setItem('budgets', JSON.stringify([...budgets, newBudget]));
      }
    }
  };

  const updateBudget = async (updatedBudget: Budget) => {
    setBudgets(
      budgets.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
    const user = auth.currentUser;
    if (user) {
      try {
        const db = getDatabase();
        await set(ref(db, `users/${user.uid}/budgets/${updatedBudget.id}`), updatedBudget);
      } catch (error) {
        console.error('Failed to update budget in Firebase:', error);
      }
    }
  };

  const deleteBudget = async (id: string) => {
    setBudgets(budgets.filter((budget) => budget.id !== id));
    const user = auth.currentUser;
    if (user) {
      try {
        const db = getDatabase();
        await set(ref(db, `users/${user.uid}/budgets/${id}`), null);
      } catch (error) {
        console.error('Failed to delete budget from Firebase:', error);
      }
    }
  };

  const updateCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    formatCurrency(0, newCurrency);
  };

  const resetAllData = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset ALL data? This cannot be undone.'
      )
    ) {
      try {
        const user = auth.currentUser;
        setExpenses(initialExpenses);
        setCategories(initialCategories);
        setBudgets(initialBudgets);
        setBalance(initialBalance);
        setCurrency('INR');

        if (user) {
          const db = getDatabase();
          await Promise.all([
            set(ref(db, `users/${user.uid}/expenses`), null),
            set(ref(db, `users/${user.uid}/categories`), null),
            set(ref(db, `users/${user.uid}/budgets`), null),
            set(ref(db, `users/${user.uid}/balance`), null),
            set(ref(db, `users/${user.uid}/currency`), null),
          ]);
        }

        localStorage.removeItem('expenses');
        localStorage.removeItem('categories');
        localStorage.removeItem('budgets');
        localStorage.removeItem('balance');
        localStorage.removeItem('currency');

        alert('All data has been successfully reset.');
      } catch (error) {
        console.error('Failed to reset data:', error);
        alert('Failed to reset data. Please try again.');
      }
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
        setCurrency: updateCurrency,
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
