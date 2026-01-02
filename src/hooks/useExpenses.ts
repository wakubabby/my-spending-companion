import { useState, useEffect } from 'react';
import { Expense, Debt, GradientColor } from '@/types/expense';

const STORAGE_KEY_EXPENSES = 'expense-tracker-expenses';
const STORAGE_KEY_DEBTS = 'expense-tracker-debts';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((e: any) => ({ ...e, date: new Date(e.date) }));
    }
    return [];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DEBTS);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DEBTS, JSON.stringify(debts));
  }, [debts]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt: Debt = {
      ...debt,
      id: crypto.randomUUID(),
    };
    setDebts(prev => [...prev, newDebt]);
  };

  const updateDebtPayment = (id: string, amount: number) => {
    setDebts(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, paidAmount: Math.min(d.totalAmount, Math.max(0, d.paidAmount + amount)) }
          : d
      )
    );
  };

  const removeDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const getMonthlyTotal = (month: number, year: number) => {
    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getYearlyTotal = (year: number) => {
    return expenses
      .filter(e => new Date(e.date).getFullYear() === year)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getExpensesByCategory = (month: number, year: number) => {
    const filtered = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const grouped: Record<string, number> = {};
    filtered.forEach(e => {
      grouped[e.categoryId] = (grouped[e.categoryId] || 0) + e.amount;
    });
    return grouped;
  };

  return {
    expenses,
    debts,
    addExpense,
    removeExpense,
    addDebt,
    updateDebtPayment,
    removeDebt,
    getMonthlyTotal,
    getYearlyTotal,
    getExpensesByCategory,
  };
};
