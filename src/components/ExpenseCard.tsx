import { Expense, CATEGORIES, getGradientClass } from '@/types/expense';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExpenseCardProps {
  expense: Expense;
  onRemove: (id: string) => void;
  size?: 'small' | 'large';
}

export const ExpenseCard = ({ expense, onRemove, size = 'small' }: ExpenseCardProps) => {
  const category = CATEGORIES.find(c => c.id === expense.categoryId);
  const subCategory = category?.subCategories.find(s => s.id === expense.subCategoryId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (size === 'large') {
    return (
      <div
        className={`relative rounded-2xl p-6 ${getGradientClass(expense.color)} min-h-[200px] flex flex-col justify-between group`}
      >
        <div className="flex justify-between items-start">
          <div className="text-3xl">{category?.icon || '📝'}</div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={() => onRemove(expense.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <p className="text-lg font-medium text-foreground/80">{expense.name}</p>
          <p className="text-3xl font-bold text-foreground">฿{formatCurrency(expense.amount)}</p>
          <p className="text-sm text-foreground/60 mt-1">
            {subCategory?.name || category?.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-xl p-4 ${getGradientClass(expense.color)} group cursor-pointer hover:scale-[1.02] transition-transform`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
        onClick={() => onRemove(expense.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
      <div className="text-xl mb-2">{category?.icon || '📝'}</div>
      <p className="text-sm font-medium text-foreground/80 truncate">{expense.name}</p>
      <p className="text-lg font-bold text-foreground">฿{formatCurrency(expense.amount)}</p>
    </div>
  );
};
