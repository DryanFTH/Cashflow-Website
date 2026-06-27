import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma/client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportsFilter } from '@/components/reports/reports-filter';
import { PrintButton } from '@/components/reports/print-button';
import { CategoryBreakdownTable } from '@/components/reports/category-breakdown-table';
import { TransactionsList } from '@/components/reports/transactions-list';
import { formatCurrency, cn } from '@/lib/utils';

const MONTHS = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

interface ReportsPageProps {
    searchParams: Promise<{ month?: string; year?: string; categoryId?: string }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
    const params = await searchParams;

    const yearParam = params.year ?? String(new Date().getFullYear());
    const monthParam = params.month ?? 'all';
    const categoryParam = params.categoryId ?? 'all';

    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    const where: Prisma.TransactionWhereInput = {};

    if (yearParam !== 'all') {
        const year = parseInt(yearParam);
        if (monthParam !== 'all') {
            const month = parseInt(monthParam);
            where.date = {
                gte: new Date(year, month - 1, 1),
                lte: new Date(year, month, 0, 23, 59, 59),
            };
        } else {
            where.date = {
                gte: new Date(year, 0, 1),
                lte: new Date(year, 11, 31, 23, 59, 59),
            };
        }
    }

    if (categoryParam !== 'all') {
        where.categoryId = categoryParam;
    }

    const transactions = await prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
    });

    const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
    const netTotal = totalIncome - totalExpense;
    const averageAmount =
        transactions.length > 0
            ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
            : 0;

    const breakdownMap = new Map<
        string,
        { name: string; type: 'INCOME' | 'EXPENSE'; count: number; total: number }
    >();
    for (const tx of transactions) {
        const existing = breakdownMap.get(tx.categoryId);
        if (existing) {
            existing.count += 1;
            existing.total += tx.amount;
        } else {
            breakdownMap.set(tx.categoryId, {
                name: tx.category.name,
                type: tx.type as 'INCOME' | 'EXPENSE',
                count: 1,
                total: tx.amount,
            });
        }
    }
    const breakdown = Array.from(breakdownMap.values()).sort((a, b) => b.total - a.total);

    const periodLabel =
        yearParam === 'all'
            ? 'Semua Periode'
            : monthParam === 'all'
              ? yearParam
              : `${MONTHS[parseInt(monthParam) - 1]} ${yearParam}`;

    return (
        <div className="relative space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Laporan</h1>
                    <p className="text-sm text-muted-foreground">
                        Filter dan analisis transaksi berdasarkan periode dan kategori.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ReportsFilter
                        year={yearParam}
                        month={monthParam}
                        categoryId={categoryParam}
                        categories={categories}
                    />
                    <PrintButton />
                </div>
            </div>

            <div className="hidden print:block">
                <h1 className="text-xl font-semibold">Laporan Keuangan — {periodLabel}</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Jumlah Transaksi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transactions.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pemasukan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-400">
                            {formatCurrency(totalIncome)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pengeluaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-400">
                            {formatCurrency(totalExpense)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Selisih
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={cn(
                                'text-2xl font-bold',
                                netTotal >= 0 ? 'text-emerald-400' : 'text-rose-400',
                            )}
                        >
                            {formatCurrency(netTotal)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Rata-rata
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(averageAmount)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ringkasan per Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                    <CategoryBreakdownTable
                        breakdown={breakdown}
                        totalIncome={totalIncome}
                        totalExpense={totalExpense}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detail Transaksi ({periodLabel})</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionsList transactions={transactions} />
                </CardContent>
            </Card>
        </div>
    );
}
