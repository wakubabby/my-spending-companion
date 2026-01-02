import { useState, useEffect, useRef } from 'react';
import { Plus, TrendingUp, Wallet, CreditCard, ChevronLeft, ChevronRight, BarChart3, Pencil, Image as ImageIcon, Trash2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
  
  // ระบบอัปโหลดรูปภาพพื้นหลัง
  const [bgImage, setBgImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedBg = localStorage.getItem('header-bg-image');
    if (savedBg) setBgImage(savedBg);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBgImage(base64String);
        localStorage.setItem('header-bg-image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBgImage = () => {
    setBgImage(null);
    localStorage.removeItem('header-bg-image');
  };

  const {
    expenses, debts, jars, incomes, bankAccounts,
    addExpense, updateExpense, removeExpense,
    addDebt, updateDebt, updateDebtPayment, removeDebt,
    updateJarsData, updateIncomesData, updateBankAccountsData,
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
      {/* Header ปรับปรุงใหม่: รองรับรูปภาพและเปลี่ยนสีเป็นสีเดียว (Primary) */}
      <header 
        className={cn(
          "relative text-primary-foreground px-6 pt-8 pb-12 rounded-b-[2.5rem] transition-all duration-500 overflow-hidden shadow-xl",
          !bgImage ? "bg-primary" : "bg-black"
        )}
        style={bgImage ? { 
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {/* Overlay สำหรับกรณีมีรูปภาพเพื่อให้ตัวหนังสืออ่านง่าย */}
        {bgImage && <div className="absolute inset-0 bg-black/40 z-0" />}

        <div className="max-w-lg mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-foreground/90 text-sm font-medium">2026: Debt-Free</p>
              <h1 className="text-3xl font-extrabold tracking-tight">Expense Tracker</h1>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={() => bgImage ? removeBgImage() : fileInputRef.current?.click()}
              >
                {bgImage ? <Trash2 className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
              </Button>
              <div className="bg-white/10 p-2 rounded-full">
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="text-primary-foreground hover:bg-white/20 rounded-full">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <span className="text-xl font-bold min-w-[160px] text-center drop-shadow-md">
              {MONTHS[selectedMonth]} {selectedYear + 543}
            </span>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-primary-foreground hover:bg-white/20 rounded-full">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SummaryCard title="รายจ่ายเดือนนี้" amount={monthlyTotal} variant="accent" className="bg-white/10 backdrop-blur-md border-white/20" />
            <SummaryCard title="รายจ่ายปีนี้" amount={yearlyTotal} subtitle={`ปี ${selectedYear + 543}`} variant="accent" className="bg-white/10 backdrop-blur-md border-white/20" />
          </div>
        </div>
      </header>

      <main className="px-6 -mt-6 max-w-lg mx-auto relative z-20">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
          <TabsList className="w-full bg-white backdrop-blur-md border border-border h-14 rounded-2xl p-1 shadow-sm">
            <TabsTrigger value="expenses" className="flex-1 gap-2 rounded-xl text-base data-[state=active]:shadow-md"><TrendingUp className="h-4 w-4" />รายจ่าย</TabsTrigger>
            <TabsTrigger value="debts" className="flex-1 gap-2 rounded-xl text-base data-[state=active]:shadow-md"><CreditCard className="h-4 w-4" />หนี้สิน</TabsTrigger>
            <TabsTrigger value="sixjars" className="flex-1 gap-2 rounded-xl text-base data-[state=active]:shadow-md">🏺 Six Jars</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">รายการล่าสุด</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowVisualization(!showVisualization)} className="text-primary">
                <BarChart3 className="h-4 w-4 mr-1" />{showVisualization ? 'ซ่อนภาพรวม' : 'ดูภาพรวม'}
              </Button>
            </div>

            {showVisualization && (
              <ExpenseVisualization expenses={expenses} monthlyTotal={monthlyTotal} yearlyTotal={yearlyTotal} selectedMonth={selectedMonth} selectedYear={selectedYear} />
            )}

            {Object.keys(categoryTotals).length > 0 && !showVisualization && (
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">สรุปตามหมวดหมู่</h3>
                <div className="space-y-4">
                  {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([catId, amount]) => {
                    const category = CATEGORIES.find(c => c.id === catId);
                    const percentage = (amount / monthlyTotal) * 100;
                    return (
                      <div key={catId} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">{category?.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-bold">{category?.name}</span>
                            <span className="font-medium">฿{amount.toLocaleString('th-TH')}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground w-10 text-right">{percentage.toFixed(0)}%</span>
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
                    <Button variant="ghost" size="icon" className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 h-6 w-6 bg-white/80 backdrop-blur-sm rounded-full shadow-sm" onClick={() => setEditingExpense(expense)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-[2rem] border border-dashed border-muted-foreground/20">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Wallet className="h-10 w-10 text-muted-foreground/50" /></div>
                <p className="text-muted-foreground font-medium">ยังไม่มีรายจ่ายในเดือนนี้</p>
                <Button className="mt-6 rounded-xl shadow-lg shadow-primary/20" onClick={() => setShowAddExpense(true)}><Plus className="h-4 w-4 mr-2" />เพิ่มรายจ่ายแรก</Button>
              </div>
            )}
          </div>
        )}

      {activeTab === 'debts' && (
  <div className="space-y-6">
    {debts.length > 0 && (
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10 rounded-3xl p-6 border border-rose-100 dark:border-rose-900/20 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">หนี้คงเหลือ</p>
            
            {/* แก้ไขบรรทัดนี้: เปลี่ยนจาก font-black เป็น font-medium หรือ font-normal */}
            <p className="text-3xl font-semibold text-foreground tracking-tighter">
              ฿{remainingDebt.toLocaleString('th-TH')}
            </p>
            
          </div>
          <div className="text-right">
            {/* ส่วนจ่ายแล้วข้างบนก็ควรปรับให้บางลงด้วยเพื่อความสวยงาม */}
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">จ่ายแล้ว</p>
            <p className="text-xl font-medium text-green-600">฿{totalPaidDebt.toLocaleString('th-TH')}</p>
          </div>
        </div>
                <div className="h-3 bg-white dark:bg-black/20 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-rose-400 to-primary rounded-full transition-all duration-1000" style={{ width: `${totalDebt > 0 ? (totalPaidDebt / totalDebt) * 100 : 0}%` }} />
                </div>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs font-medium text-muted-foreground">เป้าหมาย: ฿{totalDebt.toLocaleString('th-TH')}</p>
                    <p className="text-xs font-bold text-primary">{totalDebt > 0 ? ((totalPaidDebt / totalDebt) * 100).toFixed(1) : 0}%</p>
                </div>
              </div>
            )}

            {debts.length > 0 ? (
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="relative group">
                    <DebtCard debt={debt} onUpdatePayment={updateDebtPayment} onRemove={removeDebt} />
                    <Button variant="ghost" size="icon" className="absolute top-3 right-12 opacity-0 group-hover:opacity-100 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm" onClick={() => setEditingDebt(debt)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-[2rem] border border-dashed border-muted-foreground/20">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><CreditCard className="h-10 w-10 text-muted-foreground/50" /></div>
                <p className="text-muted-foreground font-medium">ยังไม่มีหนี้สินที่ต้องติดตาม</p>
                <Button className="mt-6 rounded-xl shadow-lg shadow-primary/20" onClick={() => setShowAddDebt(true)}><Plus className="h-4 w-4 mr-2" />เพิ่มข้อมูลหนี้สิน</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sixjars' && (
          <SixJarsTab 
            jars={jars} 
            incomes={incomes} 
            bankAccounts={bankAccounts} 
            onUpdateJars={updateJarsData} 
            onUpdateIncomes={updateIncomesData} 
            onUpdateBankAccounts={updateBankAccountsData} 
          />
        )}
      </main>

      {activeTab !== 'sixjars' && (
        <Button size="lg" className="fixed bottom-8 right-8 h-16 w-16 rounded-2xl shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all" onClick={() => activeTab === 'expenses' ? setShowAddExpense(true) : setShowAddDebt(true)}>
          <Plus className="h-8 w-8" />
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