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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES, GRADIENT_COLORS, GradientColor, CategoryType, getGradientClass, Expense } from '@/types/expense';
import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';

interface EditExpenseModalProps {
  open: boolean;
  onClose: () => void;
  expense: Expense | null;
  onSave: (expense: Expense) => void;
}

const CATEGORY_TYPES: { id: CategoryType; name: string; emoji: string }[] = [
  { id: 'needs', name: 'จำเป็น', emoji: '🏠' },
  { id: 'lifestyle', name: 'ไลฟ์สไตล์', emoji: '🎯' },
  { id: 'savings', name: 'เงินออม', emoji: '💰' },
];

export const EditExpenseModal = ({ open, onClose, expense, onSave }: EditExpenseModalProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryType, setCategoryType] = useState<CategoryType>('needs');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [color, setColor] = useState<GradientColor>('pink');
  const [customIcon, setCustomIcon] = useState<string | undefined>();

  useEffect(() => {
    if (expense) {
      setName(expense.name);
      setAmount(expense.amount.toString());
      setCategoryId(expense.categoryId);
      setSubCategoryId(expense.subCategoryId || '');
      setColor(expense.color);
      setCustomIcon(expense.customIcon);
      const category = CATEGORIES.find(c => c.id === expense.categoryId);
      if (category) setCategoryType(category.type);
    }
  }, [expense]);

  const filteredCategories = CATEGORIES.filter(c => c.type === categoryType);
  const selectedCategory = CATEGORIES.find(c => c.id === categoryId);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCustomIcon(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !amount || !categoryId || !expense) return;
    onSave({
      ...expense,
      name,
      amount: parseFloat(amount),
      categoryId,
      subCategoryId: subCategoryId || undefined,
      color,
      customIcon,
    });
    onClose();
  };

  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* ปรับความกว้างเป็น md (500px+) เพื่อให้นั่งสองคอลัมน์ได้ไม่อึดอัด */}
      <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-3xl p-6 outline-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">แก้ไขรายจ่าย</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* แถวที่ 1: ชื่อรายการ และ จำนวนเงิน (2 คอลัมน์) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">ชื่อรายการ</Label>
              <Input
                placeholder="ชื่อรายการ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">จำนวนเงิน</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">฿</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 pl-8 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>

          {/* แถวที่ 2: ไอคอนกำหนดเอง และ ประเภท (แบ่งสัดส่วน) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-4 space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">ไอคอน</Label>
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl border overflow-hidden shrink-0">
                  {customIcon ? <img src={customIcon} className="w-full h-full object-cover" /> : selectedCategory?.icon || '📝'}
                </div>
                <label className="flex-1 cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleIconUpload} className="hidden" />
                  <div className="h-11 flex items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 hover:bg-accent transition-colors text-xs font-bold text-muted-foreground">
                    อัพโหลด
                  </div>
                </label>
              </div>
            </div>
            <div className="sm:col-span-8 space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">ประเภท</Label>
              <div className="flex gap-1.5 bg-muted/50 p-1 rounded-xl border">
                {CATEGORY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => { setCategoryType(type.id); setCategoryId(''); setSubCategoryId(''); }}
                    className={cn(
                      "flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg transition-all text-xs font-bold",
                      categoryType === type.id ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:bg-white/50"
                    )}
                  >
                    <span>{type.emoji}</span> {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* แถวที่ 3: หมวดหมู่ และ หมวดหมู่ย่อย (2 คอลัมน์) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">หมวดหมู่</Label>
              <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setSubCategoryId(''); }}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2"><span>{cat.icon}</span> {cat.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold uppercase ml-1">หมวดหมู่ย่อย</Label>
              <Select value={subCategoryId} onValueChange={setSubCategoryId} disabled={!selectedCategory || selectedCategory.subCategories.length === 0}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="หมวดหมู่ย่อย" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {selectedCategory?.subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      <span className="flex items-center gap-2"><span>{sub.icon}</span> {sub.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* แถวที่ 4: สี และ ปุ่มบันทึก (จัดวางให้กระชับ) */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:flex-1">
               <Label className="text-muted-foreground text-xs font-bold uppercase ml-1 block mb-2">สีธีม</Label>
               <div className="flex gap-2">
                {GRADIENT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={cn(
                      'h-8 w-8 rounded-full transition-all border-2',
                      getGradientClass(c.id),
                      color === c.id ? 'border-primary scale-110 shadow-md' : 'border-transparent opacity-70'
                    )}
                  />
                ))}
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              className="w-full sm:w-[160px] h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
            >
              บันทึก
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};