import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GRADIENT_COLORS, GradientColor, getGradientClass } from '@/types/expense';
import { cn } from '@/lib/utils';

interface AddDebtModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (debt: {
    name: string;
    icon: string;
    totalAmount: number;
    paidAmount: number;
    color: GradientColor;
  }) => void;
}

const DEBT_ICONS = ['💳', '🏠', '🚗', '🐻', '📱', '💰', '🎓', '✈️'];

export const AddDebtModal = ({ open, onClose, onAdd }: AddDebtModalProps) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💳');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [color, setColor] = useState<GradientColor>('pink');

  const handleSubmit = () => {
    if (!name || !totalAmount) return;

    onAdd({
      name,
      icon,
      totalAmount: parseFloat(totalAmount),
      paidAmount: parseFloat(paidAmount) || 0,
      color,
    });

    // Reset form
    setName('');
    setIcon('💳');
    setTotalAmount('');
    setPaidAmount('');
    setColor('pink');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* ปรับความกว้างเป็น 500px (max-w-[500px]) เพื่อให้กว้างขึ้นและนั่ง 2 คอลัมน์ได้ไม่อึดอัด */}
      <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[2rem] p-6 outline-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">เพิ่มหนี้สิน</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ชื่อหนี้สิน (เต็มแถว) */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">ชื่อหนี้</Label>
            <Input
              placeholder="เช่น หนี้บัตรเครดิต"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl text-base"
            />
          </div>

          {/* ไอคอน (เต็มแถว) */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">ไอคอน</Label>
            <div className="flex gap-2 flex-wrap bg-muted/30 p-2 rounded-xl border border-border/50">
              {DEBT_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={cn(
                    'h-10 w-10 rounded-lg text-lg flex items-center justify-center transition-all bg-background border border-border shadow-sm',
                    icon === i ? 'ring-2 ring-primary border-primary scale-110' : 'hover:bg-muted'
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* แบ่ง 2 คอลัมน์: ยอดหนี้ทั้งหมด และ จ่ายไปแล้ว */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">ยอดหนี้ทั้งหมด</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">฿</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="h-11 pl-7 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">จ่ายไปแล้ว</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">฿</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="h-11 pl-7 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>

          {/* แถวสีธีม ปรับเป็นวงกลมขนาดเล็ก และจัดเรียงกว้างขึ้น */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">สีธีมรายการ</Label>
            <div className="flex flex-wrap gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50">
              {GRADIENT_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={cn(
                    'h-7 w-7 rounded-full transition-all border-2 shadow-sm',
                    getGradientClass(c.id),
                    color === c.id 
                      ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-md' 
                      : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                  )}
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full h-12 text-base font-bold rounded-2xl shadow-lg shadow-primary/10 mt-2 transition-all active:scale-[0.98]"
          >
            บันทึกข้อมูล
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};