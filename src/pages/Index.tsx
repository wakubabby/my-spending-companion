import { useState } from 'react';
import { Plus, TrendingUp, Wallet, CreditCard, ChevronLeft, ChevronRight, BarChart3, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseCard } from '@/components/ExpenseCard';
import { DebtCard } from '@/components/DebtCard';
import { SummaryCard } from '@/components/SummaryCard';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { AddDebtModal } from '@/components/AddDebtModal';
import { EditExpenseModal } from '@/components/EditExpenseModal';
import { EditDebtModal } from '@/components/EditDebtModal';
import { ExpenseVisualization } from '@/components/ExpenseVisualization';
import { SixJarsTab } from '@/components/SixJarsTab';
import { CATEGORIES, Expense, Debt } from '@/types/expense';

const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const Index = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [activeTab, setActiveTab] = useState<'expenses' | 'debts' | 'sixjars'>('expenses');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showVisualization, setShowVisualization] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const {
    expenses, debts, jars, incomes, bankAccounts,
    addExpense, updateExpense, removeExpense,
    addDebt, updateDebt, updateDebtPayment, removeDebt,
    setJars, setIncomes, setBankAccounts,
    getMonthlyTotal, getYearlyTotal, getExpensesByCategory,
  } = useExpenses();

  const monthlyTotal = getMonthlyTotal(selectedMonth, selectedYear);
  const yearlyTotal = getYearlyTotal(selectedYear);
  const categoryTotals = getExpensesByCategory(selectedMonth, selectedYear);

  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalDebt = debts.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalPaidDebt = debts.reduce((sum, d) => sum + d.paidAmount, 0);
  const remainingDebt = totalDebt - totalPaidDebt;

  const handlePrevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else { setSelectedMonth(m => m - 1); }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else { setSelectedMonth(m => m + 1); }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground px-6 pt-8 pb-12 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-foreground/80 text-sm">ยินดีต้อนรับ</p>
              <h1 className="text-2xl font-bold">Expense Tracker</h1>
            </div>
            <Wallet className="h-8 w-8 opacity-80" />
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="text-primary-foreground hover:bg-primary-foreground/20">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-lg font-medium min-w-[140px] text-center">{MONTHS[selectedMonth]} {selectedYear + 543}</span>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-primary-foreground hover:bg-primary-foreground/20">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SummaryCard title="รายจ่ายเดือนนี้" amount={monthlyTotal} variant="accent" />
            <SummaryCard title="รายจ่ายปีนี้" amount={yearlyTotal} subtitle={`ปี ${selectedYear + 543}`} variant="accent" />
          </div>
        </div>
      </header>

      <main className="px-6 -mt-4 max-w-lg mx-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
          <TabsList className="w-full bg-card border border-border">
            <TabsTrigger value="expenses" className="flex-1 gap-2"><TrendingUp className="h-4 w-4" />รายจ่าย</TabsTrigger>
            <TabsTrigger value="debts" className="flex-1 gap-2"><CreditCard className="h-4 w-4" />หนี้สิน</TabsTrigger>
            <TabsTrigger value="sixjars" className="flex-1 gap-2">🏺 Six Jars</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowVisualization(!showVisualization)}>
                <BarChart3 className="h-4 w-4 mr-1" />{showVisualization ? 'ซ่อนภาพรวม' : 'ดูภาพรวม'}
              </Button>
            </div>

            {showVisualization && (
              <ExpenseVisualization expenses={expenses} monthlyTotal={monthlyTotal} yearlyTotal={yearlyTotal} selectedMonth={selectedMonth} selectedYear={selectedYear} />
            )}

            {Object.keys(categoryTotals).length > 0 && !showVisualization && (
              <div className="bg-card rounded-2xl p-4 border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">สรุปตามหมวดหมู่</h3>
                <div className="space-y-2">
                  {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([catId, amount]) => {
                    const category = CATEGORIES.find(c => c.id === catId);
                    const percentage = (amount / monthlyTotal) * 100;
                    return (
                      <div key={catId} className="flex items-center gap-3">
                        <span className="text-lg">{category?.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground">{category?.name}</span>
                            <span className="text-muted-foreground">฿{amount.toLocaleString('th-TH')}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">{percentage.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {monthExpenses.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {monthExpenses.map((expense, index) => (
                  <div key={expense.id} className="relative group">
                    <ExpenseCard expense={expense} onRemove={removeExpense} size={index === 0 ? 'large' : 'small'} />
                    <Button variant="ghost" size="icon" className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 h-6 w-6" onClick={() => setEditingExpense(expense)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Wallet className="h-8 w-8 text-muted-foreground" /></div>
                <p className="text-muted-foreground">ยังไม่มีรายจ่ายในเดือนนี้</p>
                <Button className="mt-4" onClick={() => setShowAddExpense(true)}><Plus className="h-4 w-4 mr-2" />เพิ่มรายจ่าย</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'debts' && (
          <div className="space-y-6">
            {debts.length > 0 && (
              <div className="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <div><p className="text-sm text-foreground/70">หนี้คงเหลือ</p><p className="text-2xl font-bold text-foreground">฿{remainingDebt.toLocaleString('th-TH')}</p></div>
                  <div className="text-right"><p className="text-sm text-foreground/70">จ่ายแล้ว</p><p className="text-lg font-semibold text-foreground">฿{totalPaidDebt.toLocaleString('th-TH')}</p></div>
                </div>
                <div className="h-2 bg-card/50 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${totalDebt > 0 ? (totalPaidDebt / totalDebt) * 100 : 0}%` }} /></div>
                <p className="text-xs text-foreground/60 mt-2">ยอดรวมทั้งหมด ฿{totalDebt.toLocaleString('th-TH')}</p>
              </div>
            )}

            {debts.length > 0 ? (
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="relative group">
                    <DebtCard debt={debt} onUpdatePayment={updateDebtPayment} onRemove={removeDebt} />
                    <Button variant="ghost" size="icon" className="absolute top-3 right-12 opacity-0 group-hover:opacity-100 h-7 w-7" onClick={() => setEditingDebt(debt)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><CreditCard className="h-8 w-8 text-muted-foreground" /></div>
                <p className="text-muted-foreground">ยังไม่มีหนี้สินที่ต้องติดตาม</p>
                <Button className="mt-4" onClick={() => setShowAddDebt(true)}><Plus className="h-4 w-4 mr-2" />เพิ่มหนี้สิน</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sixjars' && (
          <SixJarsTab jars={jars} incomes={incomes} bankAccounts={bankAccounts} onUpdateJars={setJars} onUpdateIncomes={setIncomes} onUpdateBankAccounts={setBankAccounts} />
        )}
      </main>

      {activeTab !== 'sixjars' && (
        <Button size="lg" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" onClick={() => activeTab === 'expenses' ? setShowAddExpense(true) : setShowAddDebt(true)}>
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <AddExpenseModal open={showAddExpense} onClose={() => setShowAddExpense(false)} onAdd={addExpense} />
      <AddDebtModal open={showAddDebt} onClose={() => setShowAddDebt(false)} onAdd={addDebt} />
      <EditExpenseModal open={!!editingExpense} onClose={() => setEditingExpense(null)} expense={editingExpense} onSave={updateExpense} />
      <EditDebtModal open={!!editingDebt} onClose={() => setEditingDebt(null)} debt={editingDebt} onSave={updateDebt} />
    </div>
  );
};

export default Index;
