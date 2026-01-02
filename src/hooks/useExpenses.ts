import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Expense, Debt, Jar, Income, BankAccount } from '@/types/expense';
import { useToast } from './use-toast';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [jars, setJars] = useState<Jar[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // --- 1. Fetch Data from Supabase ---
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [expRes, debtRes, jarRes, incRes, bankRes] = await Promise.all([
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('debts').select('*'),
        supabase.from('jars').select('*').order('created_at', { ascending: true }),
        supabase.from('incomes').select('*').order('date', { ascending: false }),
        supabase.from('bank_accounts').select('*'),
      ]);

      if (expRes.data) setExpenses(expRes.data.map(e => ({
        ...e,
        categoryId: e.category_id,
        subCategoryId: e.sub_category_id,
        customIcon: e.custom_icon,
        date: new Date(e.date)
      })));
      
      if (debtRes.data) setDebts(debtRes.data.map(d => ({
        ...d,
        totalAmount: Number(d.total_amount),
        paidAmount: Number(d.paid_amount),
        customIcon: d.custom_icon
      })));

      if (jarRes.data) setJars(jarRes.data.map(j => ({
        ...j,
        percentage: Number(j.percentage),
        currentAmount: Number(j.current_amount),
        targetAmount: j.target_amount ? Number(j.target_amount) : undefined
      })));

      if (incRes.data) setIncomes(incRes.data.map(i => ({ 
        ...i, 
        amount: Number(i.amount),
        date: new Date(i.date) 
      })));

      if (bankRes.data) setBankAccounts(bankRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- 2. Expense Actions ---
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const { error } = await supabase
      .from('expenses')
      .insert([{
        name: expense.name,
        amount: expense.amount,
        category_id: expense.categoryId,
        sub_category_id: expense.subCategoryId,
        color: expense.color,
        date: expense.date.toISOString(),
      }]);

    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    fetchAllData();
  };

  const updateExpense = async (expense: Expense) => {
    const { error } = await supabase
      .from('expenses')
      .update({
        name: expense.name,
        amount: expense.amount,
        category_id: expense.categoryId,
        sub_category_id: expense.subCategoryId,
        color: expense.color,
        custom_icon: expense.customIcon
      })
      .eq('id', expense.id);

    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    fetchAllData();
  };

  const removeExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // --- 3. Debt Actions ---
  const addDebt = async (debt: Omit<Debt, 'id'>) => {
    const { error } = await supabase.from('debts').insert([{
      name: debt.name,
      icon: debt.icon,
      total_amount: debt.totalAmount,
      paid_amount: debt.paidAmount,
      color: debt.color
    }]);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    fetchAllData();
  };

  const updateDebt = async (debt: Debt) => {
    const { error } = await supabase
      .from('debts')
      .update({
        name: debt.name,
        total_amount: debt.totalAmount,
        paid_amount: debt.paidAmount,
        color: debt.color,
        icon: debt.icon,
        custom_icon: debt.customIcon
      })
      .eq('id', debt.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    fetchAllData();
  };

  const updateDebtPayment = async (id: string, amount: number) => {
    const debt = debts.find(d => d.id === id);
    if (!debt) return;
    const newPaidAmount = Math.min(debt.totalAmount, Math.max(0, debt.paidAmount + amount));
    
    const { error } = await supabase
      .from('debts')
      .update({ paid_amount: newPaidAmount })
      .eq('id', id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    fetchAllData();
  };

  const removeDebt = async (id: string) => {
    const { error } = await supabase.from('debts').delete().eq('id', id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  // --- 4. Six Jars & Income Actions (ใช้ชื่อใหม่เพื่อไม่ให้ซ้ำกับ state) ---
  
  const updateJarsData = async (newJars: Jar[]) => {
    const { error } = await supabase
      .from('jars')
      .upsert(newJars.map(j => ({
        id: j.id.length > 20 ? j.id : undefined,
        name: j.name,
        description: j.description,
        percentage: j.percentage,
        emoji: j.emoji,
        color: j.color,
        current_amount: j.currentAmount,
        target_amount: j.targetAmount
      })));

    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    fetchAllData();
  };

  const updateIncomesData = async (newIncomes: Income[]) => {
    const { error } = await supabase
      .from('incomes')
      .upsert(newIncomes.map(i => ({
        id: i.id.length > 20 ? i.id : undefined,
        name: i.name,
        amount: i.amount,
        type: i.type,
        date: i.date.toISOString()
      })));

    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    fetchAllData();
  };

  const updateBankAccountsData = async (accounts: BankAccount[]) => {
    const { error } = await supabase.from('bank_accounts').upsert(accounts);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    fetchAllData();
  };

  // --- 5. Helper Functions ---
  const getMonthlyTotal = (month: number, year: number) => {
    return expenses
      .filter(e => e.date.getMonth() === month && e.date.getFullYear() === year)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getYearlyTotal = (year: number) => {
    return expenses
      .filter(e => e.date.getFullYear() === year)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getExpensesByCategory = (month: number, year: number) => {
    const filtered = expenses.filter(e => e.date.getMonth() === month && e.date.getFullYear() === year);
    const grouped: Record<string, number> = {};
    filtered.forEach(e => { grouped[e.categoryId] = (grouped[e.categoryId] || 0) + e.amount; });
    return grouped;
  };

  return {
    expenses, debts, jars, incomes, bankAccounts, loading,
    updateJarsData, updateIncomesData, updateBankAccountsData,
    addExpense, updateExpense, removeExpense,
    addDebt, updateDebt, updateDebtPayment, removeDebt,
    getMonthlyTotal, getYearlyTotal, getExpensesByCategory,
    fetchAllData
  };
};