import { Debt, getGradientClass } from '@/types/expense';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
    <div className={cn(
      "rounded-[2rem] p-6 transition-all duration-300 group relative shadow-sm hover:shadow-md border border-white/10",
      getGradientClass(debt.color)
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full bg-white/20 hover:bg-destructive hover:text-white"
        onClick={() => onRemove(debt.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <div className="flex items-start gap-4 mb-5">
        <div className="shrink-0 shadow-lg rounded-2xl overflow-hidden bg-white/30 backdrop-blur-sm border border-white/40">
          {debt.customIcon ? (
            <img 
              src={debt.customIcon} 
              alt={debt.name} 
              className="w-12 h-12 object-cover" 
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-2xl">
              {debt.icon}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-lg truncate leading-tight mb-1">{debt.name}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">คงเหลือ</span>
            {/* ปรับความหนาลงจาก font-black เป็น font-semibold */}
            <span className="font-medium text-foreground text-xl tracking-tight">
              ฿{formatCurrency(remaining)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">จ่ายแล้ว</p>
            <p className="font-semibold text-sm text-foreground/80">฿{formatCurrency(debt.paidAmount)}</p>
          </div>
          <span className="font-bold text-primary text-sm bg-white/40 px-2 py-0.5 rounded-lg shadow-sm">
            {progress.toFixed(0)}%
          </span>
        </div>
        <Progress value={progress} className="h-2.5 bg-white/30 shadow-inner" />
        <p className="text-[10px] font-bold text-foreground/40 text-right uppercase tracking-tighter">
          เป้าหมายทั้งหมด ฿{formatCurrency(debt.totalAmount)}
        </p>
      </div>

      {showInput ? (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground/40">฿</span>
            <Input
              type="number"
              placeholder="0"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="h-10 pl-6 bg-white/50 border-none rounded-xl font-semibold placeholder:text-foreground/20 focus-visible:ring-primary/30"
              autoFocus
            />
          </div>
          <Button 
            size="icon" 
            onClick={() => handlePayment(true)} 
            className="h-10 w-10 rounded-xl shadow-md active:scale-90 transition-transform"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            onClick={() => handlePayment(false)} 
            className="h-10 w-10 rounded-xl shadow-md bg-white/50 active:scale-90 transition-transform"
          >
            <Minus className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="w-full h-10 rounded-xl bg-white/40 hover:bg-white/60 text-foreground font-semibold shadow-sm transition-all active:scale-[0.98]"
          onClick={() => setShowInput(true)}
        >
          บันทึกยอดชำระ
        </Button>
      )}
    </div>
  );
};