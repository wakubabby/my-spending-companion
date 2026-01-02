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
import { Upload } from 'lucide-react';

interface EditExpenseModalProps {
  open: boolean;
  onClose: () => void;
  expense: Expense | null;
  onSave: (expense: Expense) => void;
}

const CATEGORY_TYPES: { id: CategoryType; name: string; emoji: string }[] = [
  { id: 'needs', name: 'ค่าใช้จ่ายจำเป็น', emoji: '🏠' },
  { id: 'lifestyle', name: 'ค่าใช้จ่ายดำเนินชีวิต', emoji: '🎯' },
  { id: 'savings', name: 'เงินออมและลงทุน', emoji: '💰' },
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
      if (category) {
        setCategoryType(category.type);
      }
    }
  }, [expense]);

  const filteredCategories = CATEGORIES.filter(c => c.type === categoryType);
  const selectedCategory = CATEGORIES.find(c => c.id === categoryId);

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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">แก้ไขรายจ่าย</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ชื่อรายการ</Label>
            <Input
              placeholder="เช่น ค่าอาหารกลางวัน"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">จำนวนเงิน</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">฿</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ไอคอนกำหนดเอง</Label>
            <div className="flex items-center gap-3">
              {customIcon ? (
                <img src={customIcon} alt="icon" className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                  {selectedCategory?.icon || '📝'}
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
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">ประเภท</Label>
            <div className="flex gap-2">
              {CATEGORY_TYPES.map((type) => (
                <Button
                  key={type.id}
                  variant={categoryType === type.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setCategoryType(type.id);
                    setCategoryId('');
                    setSubCategoryId('');
                  }}
                  className="flex-1 h-10"
                >
                  <span className="mr-1">{type.emoji}</span>
                  <span className="text-xs">{type.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">หมวดหมู่</Label>
            <Select value={categoryId} onValueChange={(value) => {
              setCategoryId(value);
              setSubCategoryId('');
            }}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && selectedCategory.subCategories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">หมวดย่อย</Label>
              <Select value={subCategoryId} onValueChange={setSubCategoryId}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="เลือกหมวดย่อย (ไม่บังคับ)" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {selectedCategory.subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      <span className="flex items-center gap-2">
                        <span>{sub.icon}</span>
                        <span>{sub.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
