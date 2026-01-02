export type CategoryType = 'needs' | 'lifestyle' | 'savings' | 'debt';

export type GradientColor = 
  | 'pink' 
  | 'blue' 
  | 'purple' 
  | 'green' 
  | 'yellow' 
  | 'orange' 
  | 'mint' 
  | 'lavender';

export interface SubCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  subCategories: SubCategory[];
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  subCategoryId?: string;
  date: Date;
  color: GradientColor;
  note?: string;
}

export interface Debt {
  id: string;
  name: string;
  icon: string;
  totalAmount: number;
  paidAmount: number;
  color: GradientColor;
}

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'อาหาร',
    type: 'needs',
    icon: '🍽️',
    subCategories: [
      { id: 'daily-food', name: 'ค่าอาหารประจำวัน', icon: '🍜' },
      { id: 'groceries', name: 'ค่ากับข้าว', icon: '🥬' },
    ],
  },
  {
    id: 'housing',
    name: 'ที่อยู่อาศัย',
    type: 'needs',
    icon: '🏠',
    subCategories: [
      { id: 'rent', name: 'ค่าเช่าบ้าน/คอนโด', icon: '🏢' },
      { id: 'mortgage', name: 'ค่าผ่อนบ้าน', icon: '🏡' },
      { id: 'common-fee', name: 'ค่าส่วนกลาง', icon: '🏗️' },
    ],
  },
  {
    id: 'utilities',
    name: 'สาธารณูปโภค',
    type: 'needs',
    icon: '💡',
    subCategories: [
      { id: 'water', name: 'ค่าน้ำ', icon: '💧' },
      { id: 'electricity', name: 'ค่าไฟ', icon: '⚡' },
      { id: 'internet', name: 'ค่าอินเทอร์เน็ต', icon: '📶' },
      { id: 'phone', name: 'ค่าโทรศัพท์', icon: '📱' },
    ],
  },
  {
    id: 'transport',
    name: 'การเดินทาง',
    type: 'needs',
    icon: '🚗',
    subCategories: [
      { id: 'fuel', name: 'ค่าน้ำมัน', icon: '⛽' },
    ],
  },
  {
    id: 'health',
    name: 'สุขภาพและส่วนตัว',
    type: 'needs',
    icon: '💊',
    subCategories: [
      { id: 'personal-items', name: 'ของใช้ส่วนตัว', icon: '🧴' },
      { id: 'medical', name: 'ค่ารักษาพยาบาล/ยา', icon: '🏥' },
    ],
  },
  {
    id: 'debt-payment',
    name: 'หนี้สิน',
    type: 'needs',
    icon: '💳',
    subCategories: [
      { id: 'car-loan', name: 'ค่าผ่อนรถ', icon: '🚙' },
      { id: 'credit-card', name: 'บัตรเครดิต', icon: '💳' },
      { id: 'home-loan', name: 'ผ่อนบ้าน', icon: '🏠' },
    ],
  },
  {
    id: 'pets',
    name: 'สัตว์เลี้ยง',
    type: 'needs',
    icon: '🐾',
    subCategories: [
      { id: 'cat-litter', name: 'ทรายแมว', icon: '🐱' },
      { id: 'dog-food', name: 'อาหารหมา', icon: '🐕' },
      { id: 'cat-food', name: 'อาหารแมว', icon: '🐈' },
      { id: 'dog-vet', name: 'ค่ารักษาหมา', icon: '🩺' },
      { id: 'cat-vet', name: 'ค่ารักษาแมว', icon: '💉' },
      { id: 'pet-toys', name: 'ของเล่น/ขนม', icon: '🧸' },
    ],
  },
  {
    id: 'entertainment',
    name: 'บันเทิง/ชอปปิง',
    type: 'lifestyle',
    icon: '🛍️',
    subCategories: [
      { id: 'clothes', name: 'ชอปปิงเสื้อผ้า', icon: '👗' },
      { id: 'movies', name: 'ดูหนัง', icon: '🎬' },
      { id: 'travel', name: 'ท่องเที่ยว', icon: '✈️' },
      { id: 'misc', name: 'เบ็ดเตล็ด', icon: '📦' },
    ],
  },
  {
    id: 'self-development',
    name: 'พัฒนาตัวเอง',
    type: 'lifestyle',
    icon: '📚',
    subCategories: [
      { id: 'books', name: 'ค่าหนังสือ', icon: '📖' },
      { id: 'courses', name: 'คอร์สเรียน', icon: '🎓' },
    ],
  },
  {
    id: 'subscription',
    name: 'Subscription',
    type: 'lifestyle',
    icon: '📺',
    subCategories: [
      { id: 'monthly-sub', name: 'รายเดือน', icon: '📅' },
      { id: 'yearly-sub', name: 'รายปี', icon: '📆' },
    ],
  },
  {
    id: 'emergency-fund',
    name: 'เงินออมฉุกเฉิน',
    type: 'savings',
    icon: '🏦',
    subCategories: [],
  },
  {
    id: 'investment',
    name: 'เงินลงทุน',
    type: 'savings',
    icon: '📈',
    subCategories: [
      { id: 'stocks', name: 'หุ้น', icon: '📊' },
      { id: 'funds', name: 'กองทุน', icon: '💹' },
    ],
  },
];

export const GRADIENT_COLORS: { id: GradientColor; class: string }[] = [
  { id: 'pink', class: 'bg-gradient-to-br from-pink-200 to-pink-300' },
  { id: 'blue', class: 'bg-gradient-to-br from-blue-200 to-cyan-200' },
  { id: 'purple', class: 'bg-gradient-to-br from-purple-200 to-violet-200' },
  { id: 'green', class: 'bg-gradient-to-br from-green-200 to-emerald-200' },
  { id: 'yellow', class: 'bg-gradient-to-br from-yellow-200 to-amber-200' },
  { id: 'orange', class: 'bg-gradient-to-br from-orange-200 to-amber-200' },
  { id: 'mint', class: 'bg-gradient-to-br from-teal-200 to-cyan-200' },
  { id: 'lavender', class: 'bg-gradient-to-br from-indigo-200 to-purple-200' },
];

export const getGradientClass = (color: GradientColor): string => {
  return GRADIENT_COLORS.find(c => c.id === color)?.class || GRADIENT_COLORS[0].class;
};
