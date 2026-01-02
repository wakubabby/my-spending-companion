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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">เพิ่มรายจ่าย</DialogTitle>
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
              <SelectContent>
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
                <SelectContent>
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
