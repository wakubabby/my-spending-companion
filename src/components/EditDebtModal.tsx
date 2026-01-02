import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GRADIENT_COLORS, GradientColor, getGradientClass, Debt } from '@/types/expense';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface EditDebtModalProps {
  open: boolean;
  onClose: () => void;
  debt: Debt | null;
  onSave: (debt: Debt) => void;
}

const DEBT_ICONS = ['💳', '🏠', '🚗', '🐻', '📱', '💰', '🎓', '✈️'];

export const EditDebtModal = ({ open, onClose, debt, onSave }: EditDebtModalProps) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💳');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [color, setColor] = useState<GradientColor>('pink');
  const [customIcon, setCustomIcon] = useState<string | undefined>();

  useEffect(() => {
    if (debt) {
      setName(debt.name);
      setIcon(debt.icon);
      setTotalAmount(debt.totalAmount.toString());
      setPaidAmount(debt.paidAmount.toString());
      setColor(debt.color);
      setCustomIcon(debt.customIcon);
    }
  }, [debt]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !totalAmount || !debt) return;

    onSave({
      ...debt,
      name,
      icon,
      totalAmount: parseFloat(totalAmount),
      paidAmount: parseFloat(paidAmount) || 0,
      color,
      customIcon,
    });

    onClose();
  };

  if (!debt) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">แก้ไขหนี้สิน</DialogTitle>
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
            <div className="flex items-center gap-3 mb-2">
              {customIcon ? (
                <img src={customIcon} alt="icon" className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                  {icon}
                </div>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">อัพโหลดไอคอน</span>
                </div>
              </label>
              {customIcon && (
                <Button variant="ghost" size="sm" onClick={() => setCustomIcon(undefined)}>
                  ลบ
                </Button>
              )}
            </div>
            {!customIcon && (
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
            )}
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
            <div className="grid grid-cols-4 gap-3">
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
