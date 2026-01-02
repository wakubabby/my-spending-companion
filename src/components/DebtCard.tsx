import { Debt, getGradientClass } from '@/types/expense';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface DebtCardProps {
  debt: Debt;
  onUpdatePayment: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
}

export const DebtCard = ({ debt, onUpdatePayment, onRemove }: DebtCardProps) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showInput, setShowInput] = useState(false);

  const progress = (debt.paidAmount / debt.totalAmount) * 100;
  const remaining = debt.totalAmount - debt.paidAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayment = (isAdding: boolean) => {
    const amount = parseFloat(paymentAmount) || 0;
    if (amount > 0) {
      onUpdatePayment(debt.id, isAdding ? amount : -amount);
      setPaymentAmount('');
      setShowInput(false);
    }
  };

  return (
    <div className={`rounded-2xl p-5 ${getGradientClass(debt.color)} group relative`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
        onClick={() => onRemove(debt.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{debt.icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{debt.name}</p>
          <p className="text-sm text-foreground/70">
            คงเหลือ ฿{formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-foreground/70">จ่ายแล้ว ฿{formatCurrency(debt.paidAmount)}</span>
          <span className="text-foreground/70">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <p className="text-xs text-foreground/60 mb-3">
        ยอดรวม ฿{formatCurrency(debt.totalAmount)}
      </p>

      {showInput ? (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="จำนวนเงิน"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="flex-1 h-9 bg-card/50"
          />
          <Button size="sm" onClick={() => handlePayment(true)} className="h-9">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handlePayment(false)} className="h-9">
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => setShowInput(true)}
        >
          บันทึกยอดชำระ
        </Button>
      )}
    </div>
  );
};
