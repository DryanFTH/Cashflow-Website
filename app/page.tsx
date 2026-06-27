import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default async function DashboardPage() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [allTx, monthTx, recentTx] = await Promise.all([
        prisma.transaction.findMany({ select: { amount: true, type: true } }),
        prisma.transaction.findMany({
            where: { date: { gte: monthStart, lte: monthEnd } },
            select: { amount: true, type: true },
        }),
        prisma.transaction.findMany({
            take: 5,
            orderBy: { date: 'desc' },
            include: { category: true },
        }),
    ]);

    const sum = (rows: typeof allTx, type: 'INCOME' | 'EXPENSE') =>
        rows.filter(t => t.type === type).reduce((a, t) => a + t.amount, 0);

    const totalIncome = sum(allTx, 'INCOME');
    const totalExpense = sum(allTx, 'EXPENSE');
    const totalBalance = totalIncome - totalExpense;

    const monthIncome = sum(monthTx, 'INCOME');
    const monthExpense = sum(monthTx, 'EXPENSE');
    const monthNet = monthIncome - monthExpense;

    // data 6 bulan terakhir untuk chart cash flow
    const chartData = await Promise.all(
        Array.from({ length: 6 }, (_, i) => i).map(async i => {
            const date = subMonths(now, 5 - i);
            const rows = await prisma.transaction.findMany({
                where: { date: { gte: startOfMonth(date), lte: endOfMonth(date) } },
                select: { amount: true, type: true },
            });
            return {
                month: format(date, 'MMM', { locale: localeId }),
                income: sum(rows, 'INCOME'),
                expense: sum(rows, 'EXPENSE'),
            };
        }),
    );

    const summaryCards = [
        { title: 'Total Saldo', value: totalBalance, icon: Wallet, color: 'text-blue-400' },
        {
            title: 'Pemasukan Bulan Ini',
            value: monthIncome,
            icon: TrendingUp,
            color: 'text-emerald-400',
        },
        {
            title: 'Pengeluaran Bulan Ini',
            value: monthExpense,
            icon: TrendingDown,
            color: 'text-rose-400',
        },
        {
            title: 'Selisih Bulan Ini',
            value: monthNet,
            icon: PiggyBank,
            color: monthNet >= 0 ? 'text-emerald-400' : 'text-rose-400',
        },
    ];

    return (
        <div className="relative space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Ringkasan kondisi keuangan — {format(now, 'MMMM yyyy', { locale: localeId })}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map(card => (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {card.title}
                            </CardTitle>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(card.value)}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2 text-foreground">
                    <CardHeader>
                        <CardTitle>Cash Flow — 6 Bulan Terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CashFlowChart data={chartData} />
                    </CardContent>
                </Card>

                <Card style={{ background: 'linear-gradient(180deg,#1b1b1b,#151515)' }}>
                    <CardHeader>
                        <CardTitle>Transaksi Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentTransactions transactions={recentTx} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
