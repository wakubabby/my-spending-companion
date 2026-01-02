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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">เพิ่มหนี้สิน</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ชื่อหนี้</Label>
            <Input
              placeholder="เช่น หนี้บัตรเครดิต"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ไอคอน</Label>
            <div className="flex gap-2 flex-wrap">
              {DEBT_ICONS.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={cn(
                    'h-11 w-11 rounded-xl text-xl flex items-center justify-center transition-all bg-muted hover:bg-muted/80',
                    icon === i ? 'ring-2 ring-primary' : ''
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ยอดหนี้ทั้งหมด</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">฿</span>
              <Input
                type="number"
                placeholder="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="h-12 pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">จ่ายไปแล้ว</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">฿</span>
              <Input
                type="number"
                placeholder="0"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="h-12 pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">สี</Label>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENT_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={cn(
                    'h-12 rounded-xl transition-all',
                    getGradientClass(c.id),
                    color === c.id ? 'ring-2 ring-primary ring-offset-2' : ''
                  )}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full h-12 text-base font-medium">
            บันทึก
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
