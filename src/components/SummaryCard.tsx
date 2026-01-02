import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

export const SummaryCard = ({
  title,
  amount,
  subtitle,
  variant = 'default',
  className,
}: SummaryCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        variant === 'default' && 'bg-card border border-border',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'accent' && 'bg-gradient-to-br from-pink-200 to-purple-200',
        className
      )}
    >
      <p className={cn(
        'text-sm font-medium mb-1',
        variant === 'default' && 'text-muted-foreground',
        variant === 'primary' && 'text-primary-foreground/80',
        variant === 'accent' && 'text-foreground/70'
      )}>
        {title}
      </p>
      <p className={cn(
        'text-2xl font-bold',
        variant === 'default' && 'text-foreground',
        variant === 'primary' && 'text-primary-foreground',
        variant === 'accent' && 'text-foreground'
      )}>
        ฿{formatCurrency(amount)}
      </p>
      {subtitle && (
        <p className={cn(
          'text-xs mt-1',
          variant === 'default' && 'text-muted-foreground',
          variant === 'primary' && 'text-primary-foreground/70',
          variant === 'accent' && 'text-foreground/60'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
