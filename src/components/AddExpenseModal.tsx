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
  { id: 'needs', name: 'จำเป็น', emoji: '🏠' },
  { id: 'lifestyle', name: 'ไลฟ์สไตล์', emoji: '🎯' },
  { id: 'savings', name: 'เงินออม', emoji: '💰' },
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
      {/* เพิ่ม sm:max-w-[600px] เพื่อให้พื้นที่กางออกด้านข้างพอสำหรับ 2 คอลัมน์ */}
      <DialogContent className="sm:max-w-[600px] w-[95vw] p-6 rounded-3xl outline-none shadow-2xl border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold px-1">เพิ่มรายจ่าย</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          
          {/* แถวที่ 1: ชื่อรายการ + จำนวนเงิน (แบ่ง 2 คอลัมน์) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 tracking-widest">ชื่อรายการ</Label>
              <Input
                placeholder="เช่น ค่าอาหารกลางวัน"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-2xl bg-muted/40 border-none text-base focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 tracking-widest">จำนวนเงิน</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">฿</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 pl-8 rounded-2xl bg-muted/40 border-none text-xl font-bold focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* แถวที่ 2: ประเภทการใช้จ่าย (กว้างเต็มแถวเพื่อให้ปุ่มกดง่าย) */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 tracking-widest">ประเภทการใช้จ่าย</Label>
            <div className="flex gap-2 bg-muted/30 p-1.5 rounded-[1.25rem] border border-border/50">
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
                    "flex-1 h-11 flex items-center justify-center gap-2 rounded-xl transition-all text-sm font-bold",
                    categoryType === type.id 
                      ? "bg-white shadow-sm text-primary ring-1 ring-black/5" 
                      : "text-muted-foreground hover:bg-white/50"
                  )}
                >
                  <span className="text-lg">{type.emoji}</span>
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* แถวที่ 3: หมวดหมู่ + หมวดหมู่ย่อย (แบ่ง 2 คอลัมน์) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 tracking-widest">หมวดหมู่</Label>
              <Select value={categoryId} onValueChange={(value) => {
                setCategoryId(value);
                setSubCategoryId('');
              }}>
                <SelectTrigger className="h-12 rounded-2xl bg-muted/40 border-none">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                {/* เพิ่ม bg-white และ shadow เพื่อให้เห็นพื้นหลังตัวเลือกชัดเจน */}
                <SelectContent className="z-[110] rounded-2xl shadow-2xl border border-border/50 bg-white">
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="rounded-xl m-1 focus:bg-primary/5 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="font-semibold">{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 tracking-widest">หมวดย่อย</Label>
              <Select 
                value={subCategoryId} 
                onValueChange={setSubCategoryId}
                disabled={!selectedCategory || selectedCategory.subCategories.length === 0}
              >
                <SelectTrigger className="h-12 rounded-2xl bg-muted/40 border-none">
                  <SelectValue placeholder="ระบุหมวดย่อย" />
                </SelectTrigger>
                <SelectContent className="z-[110] rounded-2xl shadow-2xl border border-border/50 bg-white">
                  {selectedCategory?.subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id} className="rounded-xl m-1 focus:bg-primary/5 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{sub.icon}</span>
                        <span className="font-medium">{sub.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* แถวที่ 4: สีธีม + ปุ่มบันทึก (ปรับสีให้เล็กลงเพื่อประหยัดพื้นที่) */}
          <div className="pt-2 flex flex-col sm:flex-row gap-6 items-end">
            <div className="w-full sm:flex-1 space-y-3">
              <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] ml-1">สีธีมรายการ</Label>
              <div className="flex flex-wrap gap-3 p-3.5 rounded-[1.5rem] bg-muted/30 border border-border/50">
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
              className="w-full sm:w-[180px] h-14 text-lg font-bold rounded-[1.25rem] shadow-xl shadow-primary/20 transition-all active:scale-[0.98] bg-primary hover:bg-primary/90"
            >
              บันทึกรายการ
            </Button>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
};