import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency, cn } from '@/lib/utils';

interface BreakdownItem {
    name: string;
    type: 'INCOME' | 'EXPENSE';
    count: number;
    total: number;
}

interface CategoryBreakdownTableProps {
    breakdown: BreakdownItem[];
    totalIncome: number;
    totalExpense: number;
}

export function CategoryBreakdownTable({
    breakdown,
    totalIncome,
    totalExpense,
}: CategoryBreakdownTableProps) {
    if (breakdown.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted-foreground">
                Tidak ada data untuk filter ini.
            </p>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-right">Jumlah Transaksi</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Persentase</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {breakdown.map(item => {
                    const isIncome = item.type === 'INCOME';
                    const base = isIncome ? totalIncome : totalExpense;
                    const percentage = base > 0 ? Math.round((item.total / base) * 100) : 0;

                    return (
                        <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        isIncome
                                            ? 'border-emerald-500/40 text-emerald-400'
                                            : 'border-rose-500/40 text-rose-400',
                                    )}
                                >
                                    {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">{item.count}</TableCell>
                            <TableCell
                                className={cn(
                                    'text-right font-medium',
                                    isIncome ? 'text-emerald-400' : 'text-rose-400',
                                )}
                            >
                                {formatCurrency(item.total)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {percentage}%
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
