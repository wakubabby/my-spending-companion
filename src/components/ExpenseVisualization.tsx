import { useState } from 'react';
import { Expense, CATEGORIES, getGradientClass } from '@/types/expense';
import { LayoutGrid, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpenseVisualizationProps {
  expenses: Expense[];
  monthlyTotal: number;
  yearlyTotal: number;
  selectedMonth: number;
  selectedYear: number;
}

type ViewMode = 'grid' | 'bubbles';

const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const ExpenseVisualization = ({
  expenses,
  monthlyTotal,
  yearlyTotal,
  selectedMonth,
  selectedYear,
}: ExpenseVisualizationProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [timeRange, setTimeRange] = useState<'month' | 'year'>('month');

  const filteredExpenses = timeRange === 'month'
    ? expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      })
    : expenses.filter(e => new Date(e.date).getFullYear() === selectedYear);

  const total = timeRange === 'month' ? monthlyTotal : yearlyTotal;

  // Group expenses by category
  const groupedByCategory = filteredExpenses.reduce((acc, expense) => {
    if (!acc[expense.categoryId]) {
      acc[expense.categoryId] = { amount: 0, expenses: [] };
    }
    acc[expense.categoryId].amount += expense.amount;
    acc[expense.categoryId].expenses.push(expense);
    return acc;
  }, {} as Record<string, { amount: number; expenses: Expense[] }>);

  const sortedCategories = Object.entries(groupedByCategory)
    .map(([catId, data]) => ({
      categoryId: catId,
      ...data,
      category: CATEGORIES.find(c => c.id === catId),
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={timeRange === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            รายเดือน
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange('year')}
          >
            รายปี
          </Button>
        </div>
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'bubbles' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('bubbles')}
          >
            <Circle className="h-4 w-4 mr-1" />
            Bubbles
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h3 className="text-lg font-semibold">
          {timeRange === 'month'
            ? `${MONTHS[selectedMonth]} ${selectedYear + 543}`
            : `ปี ${selectedYear + 543}`}
        </h3>
        <p className="text-2xl font-bold text-primary">฿{formatCurrency(total)}</p>
      </div>

      {sortedCategories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          ไม่มีข้อมูลรายจ่าย
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-2 gap-3">
          {sortedCategories.map((item, index) => {
            const isLarge = index === 0;
            const expense = item.expenses[0];
            return (
              <div
                key={item.categoryId}
                className={cn(
                  'rounded-2xl p-4 relative overflow-hidden',
                  getGradientClass(expense?.color || 'pink'),
                  isLarge ? 'col-span-1 row-span-2 min-h-[200px] flex flex-col justify-between' : ''
                )}
              >
                <div className="flex justify-between items-start">
                  <div className={cn("rounded-lg bg-card/30 flex items-center justify-center", isLarge ? "w-12 h-12 text-2xl" : "w-8 h-8 text-lg")}>
                    {expense?.customIcon ? (
                      <img src={expense.customIcon} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      item.category?.icon
                    )}
                  </div>
                  <span className="text-xs font-medium bg-card/40 px-2 py-1 rounded-full">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className={cn("mt-auto", isLarge ? "mt-6" : "mt-2")}>
                  <p className={cn("font-medium text-foreground/80", isLarge ? "text-lg" : "text-sm")}>
                    {item.category?.name}
                  </p>
                  <p className={cn("font-bold text-foreground", isLarge ? "text-3xl" : "text-lg")}>
                    ฿{formatCurrency(item.amount)}
                  </p>
                  {isLarge && timeRange === 'month' && (
                    <p className="text-xs text-foreground/60 mt-1">
                      ~฿{formatCurrency(item.amount * 12)}/ปี
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Bubbles View */
        <div className="relative min-h-[300px] flex items-center justify-center">
          <div className="flex flex-wrap justify-center gap-2 p-4">
            {sortedCategories.map((item) => {
              const size = Math.max(60, Math.min(150, (item.percentage / 100) * 200 + 50));
              const expense = item.expenses[0];
              return (
                <div
                  key={item.categoryId}
                  className={cn(
                    'rounded-full flex flex-col items-center justify-center p-2 transition-transform hover:scale-105',
                    getGradientClass(expense?.color || 'pink')
                  )}
                  style={{ width: size, height: size }}
                >
                  <div className="text-2xl">
                    {expense?.customIcon ? (
                      <img src={expense.customIcon} alt="" className="w-8 h-8 object-cover rounded-full" />
                    ) : (
                      item.category?.icon
                    )}
                  </div>
                  <span className="text-xs font-bold text-center truncate max-w-full px-1">
                    {item.percentage.toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-foreground/70 truncate max-w-full px-1">
                    ฿{formatCurrency(item.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">TOTAL / {timeRange === 'month' ? 'MONTH' : 'YEAR'}</p>
            <p className="text-xl font-bold">฿{formatCurrency(total)}</p>
          </div>
          {timeRange === 'month' && (
            <div className="text-right">
              <p className="text-muted-foreground">YEARLY PROJECTION</p>
              <p className="text-xl font-bold text-primary">฿{formatCurrency(total * 12)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
