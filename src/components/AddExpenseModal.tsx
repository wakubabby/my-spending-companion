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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES, GRADIENT_COLORS, GradientColor, CategoryType, getGradientClass } from '@/types/expense';
import { cn } from '@/lib/utils';

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: {
    name: string;
    amount: number;
    categoryId: string;
    subCategoryId?: string;
    date: Date;
    color: GradientColor;
  }) => void;
}

const CATEGORY_TYPES: { id: CategoryType; name: string; emoji: string }[] = [
  { id: 'needs', name: 'ค่าใช้จ่ายจำเป็น', emoji: '🏠' },
  { id: 'lifestyle', name: 'ค่าใช้จ่ายดำเนินชีวิต', emoji: '🎯' },
  { id: 'savings', name: 'เงินออมและลงทุน', emoji: '💰' },
];

export const AddExpenseModal = ({ open, onClose, onAdd }: AddExpenseModalProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryType, setCategoryType] = useState<CategoryType>('needs');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [color, setColor] = useState<GradientColor>('pink');

  const filteredCategories = CATEGORIES.filter(c => c.type === categoryType);
  const selectedCategory = CATEGORIES.find(c => c.id === categoryId);

  const handleSubmit = () => {
    if (!name || !amount || !categoryId) return;

    onAdd({
      name,
      amount: parseFloat(amount),
      categoryId,
      subCategoryId: subCategoryId || undefined,
      date: new Date(),
      color,
    });

    // Reset form
    setName('');
    setAmount('');
    setCategoryId('');
    setSubCategoryId('');
    setColor('pink');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* ปรับปรุง: 
        - sm:max-w-[480px] เพิ่มความกว้างเพื่อให้ปุ่ม "ประเภท" มีพื้นที่พอ
        - w-[95vw] สำหรับมือถือ
        - เอา max-h และ overflow-y-auto ออกเพื่อให้ขยายตามเนื้อหาจริง
      */}
      <DialogContent className="sm:max-w-[480px] w-[95vw] p-6 outline-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">เพิ่มรายจ่าย</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* ชื่อรายการ */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">ชื่อรายการ</Label>
            <Input
              placeholder="เช่น ค่าอาหารกลางวัน"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* จำนวนเงิน */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">จำนวนเงิน</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">฿</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 pl-10 text-lg font-medium"
              />
            </div>
          </div>

          {/* ประเภท (ปรับปรุงปุ่มให้แสดงผลแถวเดียวได้สวยขึ้น) */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">ประเภท</Label>
            <div className="flex gap-2">
              {CATEGORY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setCategoryType(type.id);
                    setCategoryId('');
                    setSubCategoryId('');
                  }}
                  className={cn(
                    "flex-1 h-14 flex flex-col items-center justify-center rounded-xl border transition-all px-1",
                    categoryType === type.id 
                      ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]" 
                      : "bg-background border-input hover:bg-accent text-muted-foreground"
                  )}
                >
                  <span className="text-lg leading-tight">{type.emoji}</span>
                  <span className="text-[10px] sm:text-[11px] font-bold whitespace-nowrap uppercase tracking-tighter">
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* หมวดหมู่ */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">หมวดหมู่</Label>
            <Select value={categoryId} onValueChange={(value) => {
              setCategoryId(value);
              setSubCategoryId('');
            }}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* หมวดย่อย (ถ้ามี) */}
          {selectedCategory && selectedCategory.subCategories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">หมวดย่อย</Label>
              <Select value={subCategoryId} onValueChange={setSubCategoryId}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="เลือกหมวดย่อย (ไม่บังคับ)" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {selectedCategory.subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{sub.icon}</span>
                        <span>{sub.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* เลือกสี (ปรับขนาดปุ่มสีให้กะทัดรัดขึ้น) */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">สีธีมรายการ</Label>
            <div className="grid grid-cols-4 gap-3">
              {GRADIENT_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={cn(
                    'h-10 rounded-xl transition-all border-2',
                    getGradientClass(c.id),
                    color === c.id ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                  )}
                />
              ))}
            </div>
          </div>

          {/* ปุ่มบันทึก */}
          <Button 
            onClick={handleSubmit} 
            className="w-full h-14 text-base font-bold mt-2 shadow-lg active:scale-[0.98] transition-transform"
          >
            บันทึกรายการ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};