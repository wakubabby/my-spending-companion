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
import { Upload, X } from 'lucide-react';

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
      {/* ปรับความกว้างเป็น sm:max-w-[500px] เพื่อให้กว้างขึ้นและลดความยาวลง */}
      <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[2rem] p-6 outline-none shadow-2xl overflow-y-auto max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">แก้ไขหนี้สิน</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ชื่อหนี้สิน */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 tracking-wider">ชื่อหนี้</Label>
            <Input
              placeholder="เช่น หนี้บัตรเครดิต"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-1"
            />
          </div>

          {/* ไอคอน */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 tracking-wider">ไอคอน</Label>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/50">
              <div className="relative group shrink-0">
                {customIcon ? (
                  <>
                    <img src={customIcon} alt="icon" className="w-14 h-14 rounded-xl object-cover border border-white/50 shadow-sm" />
                    <button 
                      onClick={() => setCustomIcon(undefined)}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-md transition-transform hover:scale-110"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-2xl shadow-inner border border-border">
                    {icon}
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors text-primary text-xs font-bold uppercase">
                    <Upload className="h-3 w-3" />
                    <span>อัพโหลดรูปภาพ</span>
                  </div>
                </label>
                
                {!customIcon && (
                  <div className="flex gap-1.5 flex-wrap">
                    {DEBT_ICONS.map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIcon(i)}
                        className={cn(
                          'h-8 w-8 rounded-lg text-sm flex items-center justify-center transition-all bg-background border border-border',
                          icon === i ? 'ring-2 ring-primary border-primary scale-105 shadow-sm' : 'hover:bg-muted'
                        )}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* แบ่ง 2 คอลัมน์สำหรับตัวเลข */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 tracking-wider">ยอดหนี้ทั้งหมด</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">฿</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="h-11 pl-7 rounded-xl bg-muted/30 border-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 tracking-wider">จ่ายไปแล้ว</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">฿</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="h-11 pl-7 rounded-xl bg-muted/30 border-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* ปรับช่องสีให้เล็กลง (วงกลม) */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest ml-1">สีธีมรายการ</Label>
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
            className="w-full h-12 text-base font-bold rounded-2xl shadow-lg shadow-primary/10 transition-transform active:scale-[0.98]"
          >
            บันทึกการเปลี่ยนแปลง
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};