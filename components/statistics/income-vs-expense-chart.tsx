import { cn, formatCurrency } from '@/lib/utils';

interface IncomeVsExpenseChartProps {
    totalIncome: number;
    totalExpense: number;
}

export function IncomeVsExpenseChart({
    totalIncome,
    totalExpense,
}: IncomeVsExpenseChartProps) {
    const total = totalIncome + totalExpense;
    const incomePercent = total > 0 ? (totalIncome / total) * 100 : 50;
    const expensePercent = total > 0 ? (totalExpense / total) * 100 : 50;

    return (
        <div className='space-y-4'>
            <div className='flex h-4 overflow-hidden rounded-full bg-secondary'>
                <div className='bg-emerald-500' style={{ width: `${incomePercent}%` }} />
                <div className='bg-rose-500' style={{ width: `${expensePercent}%` }} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <div className='flex items-center gap-2'>
                        <span className='h-2 w-2 rounded-full bg-emerald-500' />
                        <span className='text-sm text-muted-foreground'>Pemasukan</span>
                    </div>
                    <p className='mt-1 text-xl font-semibold text-emerald-400'>
                        {formatCurrency(totalIncome)}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                        {incomePercent.toFixed(0)}%
                    </p>
                </div>
                <div>
                    <div className='flex items-center gap-2'>
                        <span className='h-2 w-2 rounded-full bg-rose-500' />
                        <span className='text-sm text-muted-foreground'>Pengeluaran</span>
                    </div>
                    <p className={cn('mt-1 text-xl font-semibold text-rose-400')}>
                        {formatCurrency(totalExpense)}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                        {expensePercent.toFixed(0)}%
                    </p>
                </div>
            </div>
        </div>
    );
}
