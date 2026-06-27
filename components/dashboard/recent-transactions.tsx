import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { formatCurrency, cn } from '@/lib/utils';
import { Category, Transaction } from '@/lib/generated/prisma/client';

interface RecentTransactionsProps {
    transactions: (Transaction & { category: Category })[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    if (transactions.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada transaksi.</p>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map(tx => {
                const isIncome = tx.type === 'INCOME';
                return (
                    <div key={tx.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    'flex h-9 w-9 items-center justify-center rounded-full',
                                    isIncome ? 'bg-emerald-500/10' : 'bg-rose-500/10',
                                )}
                            >
                                {isIncome ? (
                                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                                ) : (
                                    <ArrowDownLeft className="h-4 w-4 text-rose-400" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium leading-none">
                                    {tx.category.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {format(tx.date, 'd MMM yyyy', { locale: localeId })}
                                </p>
                            </div>
                        </div>
                        <span
                            className={cn(
                                'text-sm font-semibold',
                                isIncome ? 'text-emerald-400' : 'text-rose-400',
                            )}
                        >
                            {isIncome ? '+' : '-'}
                            {formatCurrency(tx.amount)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
