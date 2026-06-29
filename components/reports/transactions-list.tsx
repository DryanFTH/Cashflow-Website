import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { TransactionWithCategory } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';

interface TransactionsListProps {
    transactions: TransactionWithCategory[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
    if (transactions.length === 0) {
        return (
            <p className='py-6 text-center text-sm text-muted-foreground'>
                Tidak ada transaksi untuk filter ini.
            </p>
        );
    }

    return (
        <div className='max-h-120 overflow-y-auto rounded-md border border-border'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Catatan</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead className='text-right'>Jumlah</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map(tx => {
                        const isIncome = tx.type === 'INCOME';
                        return (
                            <TableRow key={tx.id}>
                                <TableCell>
                                    {format(tx.date, 'd MMM yyyy', { locale: localeId })}
                                </TableCell>
                                <TableCell>{tx.category.name}</TableCell>
                                <TableCell className='text-muted-foreground'>
                                    {tx.description || '-'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant='outline'
                                        className={cn(
                                            'gap-1',
                                            isIncome
                                                ? 'border-emerald-500/40 text-emerald-400'
                                                : 'border-rose-500/40 text-rose-400',
                                        )}
                                    >
                                        {isIncome ? (
                                            <ArrowUpRight className='h-3 w-3' />
                                        ) : (
                                            <ArrowDownLeft className='h-3 w-3' />
                                        )}
                                        {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                                    </Badge>
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        'text-right font-medium',
                                        isIncome ? 'text-emerald-400' : 'text-rose-400',
                                    )}
                                >
                                    {isIncome ? '+' : '-'}
                                    {formatCurrency(tx.amount)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
