import { useState } from 'react';
import { Jar, Income, BankAccount, DEFAULT_JARS, GradientColor, getGradientClass } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Sparkles, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SixJarsTabProps {
  jars: Jar[];
  incomes: Income[];
  bankAccounts: BankAccount[];
  onUpdateJars: (jars: Jar[]) => void;
  onUpdateIncomes: (incomes: Income[]) => void;
  onUpdateBankAccounts: (accounts: BankAccount[]) => void;
}

export const SixJarsTab = ({
  jars,
  incomes,
  bankAccounts,
  onUpdateJars,
  onUpdateIncomes,
  onUpdateBankAccounts,
}: SixJarsTabProps) => {
  const [activeSubTab, setActiveSubTab] = useState<'jars' | 'banks'>('jars');
  const [showAddJar, setShowAddJar] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [editingJar, setEditingJar] = useState<Jar | null>(null);

  // Form states
  const [jarName, setJarName] = useState('');
  const [jarDescription, setJarDescription] = useState('');
  const [jarPercentage, setJarPercentage] = useState('10');
  const [jarEmoji, setJarEmoji] = useState('💰');
  const [jarTarget, setJarTarget] = useState('');

  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeType, setIncomeType] = useState<'regular' | 'irregular'>('regular');

  const regularIncomeTotal = incomes.filter(i => i.type === 'regular').reduce((sum, i) => sum + i.amount, 0);
  const irregularIncomeTotal = incomes.filter(i => i.type === 'irregular').reduce((sum, i) => sum + i.amount, 0);
  const totalIncome = regularIncomeTotal + irregularIncomeTotal;

  const totalPercentageUsed = jars.reduce((sum, j) => sum + j.percentage, 0);
  const remainingPercentage = 100 - totalPercentageUsed;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH').format(amount);
  };

  const resetJarForm = () => {
    setJarName('');
    setJarDescription('');
    setJarPercentage('10');
    setJarEmoji('💰');
    setJarTarget('');
    setEditingJar(null);
  };

  const handleAddPresets = () => {
    const newJars: Jar[] = DEFAULT_JARS.map(j => ({
      ...j,
      id: crypto.randomUUID(),
      currentAmount: 0,
    }));
    onUpdateJars(newJars);
  };

  const handleSaveJar = () => {
    if (!jarName || !jarPercentage) return;

    if (editingJar) {
      onUpdateJars(jars.map(j => j.id === editingJar.id ? {
        ...j,
        name: jarName,
        description: jarDescription,
        percentage: parseFloat(jarPercentage),
        emoji: jarEmoji,
        targetAmount: jarTarget ? parseFloat(jarTarget) : undefined,
      } : j));
    } else {
      const newJar: Jar = {
        id: crypto.randomUUID(),
        name: jarName,
        description: jarDescription,
        percentage: parseFloat(jarPercentage),
        emoji: jarEmoji,
        color: 'pink',
        currentAmount: 0,
        targetAmount: jarTarget ? parseFloat(jarTarget) : undefined,
      };
      onUpdateJars([...jars, newJar]);
    }
    resetJarForm();
    setShowAddJar(false);
  };

  const handleAddIncome = () => {
    if (!incomeName || !incomeAmount) return;

    const newIncome: Income = {
      id: crypto.randomUUID(),
      name: incomeName,
      amount: parseFloat(incomeAmount),
      type: incomeType,
      date: new Date(),
    };
    onUpdateIncomes([...incomes, newIncome]);
    setIncomeName('');
    setIncomeAmount('');
    setShowAddIncome(false);
  };

  const handleDeleteJar = (id: string) => {
    onUpdateJars(jars.filter(j => j.id !== id));
  };

  const handleDeleteIncome = (id: string) => {
    onUpdateIncomes(incomes.filter(i => i.id !== id));
  };

  const handleEditJar = (jar: Jar) => {
    setEditingJar(jar);
    setJarName(jar.name);
    setJarDescription(jar.description);
    setJarPercentage(jar.percentage.toString());
    setJarEmoji(jar.emoji);
    setJarTarget(jar.targetAmount?.toString() || '');
    setShowAddJar(true);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as 'jars' | 'banks')}>
        <TabsList className="w-full bg-card border border-border">
          <TabsTrigger value="jars" className="flex-1 gap-2">
            📊 กระปุก
          </TabsTrigger>
          <TabsTrigger value="banks" className="flex-1 gap-2">
            <Building2 className="h-4 w-4" />
            บัญชีธนาคาร
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeSubTab === 'jars' && (
        <>
          {/* Jar List Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">กระปุกของคุณ ({jars.length} รายการ)</h3>
            <div className="flex gap-2">
              {jars.length === 0 && (
                <Button variant="outline" size="sm" onClick={handleAddPresets}>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Preset แนะนำ
                </Button>
              )}
              <Button size="sm" onClick={() => { resetJarForm(); setShowAddJar(true); }}>
                <Plus className="h-4 w-4 mr-1" />
                เพิ่มกระปุก
              </Button>
            </div>
          </div>

          {/* Income Summary */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">รายได้ทั้งหมด</p>
                  <p className="text-3xl font-bold text-primary">฿{formatCurrency(totalIncome)}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAddIncome(true)}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  แก้ไขรายได้
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-card/50 rounded-lg p-3">
                  <p className="text-muted-foreground">⚙️ รายได้ประจำ: ฿{formatCurrency(regularIncomeTotal)}</p>
                  <p className="text-xs text-muted-foreground">จัดสรรแล้ว: {totalPercentageUsed}%</p>
                </div>
                <div className="bg-card/50 rounded-lg p-3">
                  <p className="text-muted-foreground">⚡ รายได้ไม่ประจำ: ฿{formatCurrency(irregularIncomeTotal)}</p>
                  <p className="text-xs text-muted-foreground">จัดสรรแล้ว: 100%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remaining Percentage Warning */}
          {remainingPercentage > 0 && jars.length > 0 && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg text-sm">
              💡 รายได้ประจำยังเหลือที่ไปได้จัดสรร: {remainingPercentage}%
            </div>
          )}

          {/* Jars Grid */}
          {jars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jars.map((jar) => {
                const allocatedAmount = (regularIncomeTotal * jar.percentage) / 100;
                const progress = jar.targetAmount ? (jar.currentAmount / jar.targetAmount) * 100 : 0;

                return (
                  <Card key={jar.id} className={cn("relative group", getGradientClass(jar.color))}>
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditJar(jar)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteJar(jar.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{jar.emoji}</span>
                        <div className="flex-1">
                          <p className="text-3xl font-bold">{jar.percentage}%</p>
                          <p className="font-semibold text-foreground/80">{jar.name}</p>
                          <p className="text-sm text-primary">฿{formatCurrency(allocatedAmount)}/เดือน</p>
                        </div>
                      </div>
                      {jar.targetAmount && (
                        <div className="mt-3">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            🎯 เป้าหมาย: ฿{formatCurrency(jar.targetAmount)} ({progress.toFixed(0)}%)
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🏺
              </div>
              <p className="text-muted-foreground mb-4">ยังไม่มีกระปุก เริ่มสร้างกระปุกตามหลัก Six Jars</p>
              <Button onClick={handleAddPresets}>
                <Sparkles className="h-4 w-4 mr-2" />
                ใช้ Preset แนะนำ
              </Button>
            </div>
          )}
        </>
      )}

      {activeSubTab === 'banks' && (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">ฟีเจอร์เชื่อมต่อบัญชีธนาคารกำลังพัฒนา</p>
          <p className="text-sm text-muted-foreground mt-2">สามารถผูกหลายกระปุกไว้ในบัญชีเดียวได้</p>
        </div>
      )}

      {/* Add/Edit Jar Modal */}
      <Dialog open={showAddJar} onOpenChange={(open) => { if (!open) resetJarForm(); setShowAddJar(open); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJar ? 'แก้ไขกระปุก' : 'เพิ่มกระปุก'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ชื่อกระปุก</Label>
              <Input value={jarName} onChange={(e) => setJarName(e.target.value)} placeholder="เช่น อิสรภาพทางการเงิน" />
            </div>
            <div className="space-y-2">
              <Label>คำอธิบาย</Label>
              <Input value={jarDescription} onChange={(e) => setJarDescription(e.target.value)} placeholder="เงินที่กันไว้เพื่อลงทุนระยะยาว" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>อีโมจิ</Label>
                <Input value={jarEmoji} onChange={(e) => setJarEmoji(e.target.value)} className="text-center text-2xl" />
              </div>
              <div className="space-y-2">
                <Label>จัดสรร (%)</Label>
                <div className="relative">
                  <Input type="number" value={jarPercentage} onChange={(e) => setJarPercentage(e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>เป้าหมาย (฿) - ไม่จำเป็น</Label>
              <Input type="number" value={jarTarget} onChange={(e) => setJarTarget(e.target.value)} placeholder="500000" />
            </div>
            <Button onClick={handleSaveJar} className="w-full">บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Income Modal */}
      <Dialog open={showAddIncome} onOpenChange={setShowAddIncome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>จัดการรายได้</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Existing Incomes */}
            {incomes.length > 0 && (
              <div className="space-y-2">
                <Label>รายได้ปัจจุบัน</Label>
                {incomes.map((income) => (
                  <div key={income.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{income.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {income.type === 'regular' ? '⚙️ ประจำ' : '⚡ ไม่ประจำ'} • ฿{formatCurrency(income.amount)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteIncome(income.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Income */}
            <div className="border-t pt-4 space-y-4">
              <Label>เพิ่มรายได้ใหม่</Label>
              <Input value={incomeName} onChange={(e) => setIncomeName(e.target.value)} placeholder="ชื่อรายได้ เช่น เงินเดือน" />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span>
                <Input type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} placeholder="0" className="pl-8" />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={incomeType === 'regular' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setIncomeType('regular')}
                >
                  ⚙️ ประจำ
                </Button>
                <Button
                  variant={incomeType === 'irregular' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setIncomeType('irregular')}
                >
                  ⚡ ไม่ประจำ
                </Button>
              </div>
              <Button onClick={handleAddIncome} className="w-full" disabled={!incomeName || !incomeAmount}>
                <Plus className="h-4 w-4 mr-1" />
                เพิ่มรายได้
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
