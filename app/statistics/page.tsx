import { prisma } from '@/lib/prisma';
import { startOfYear, endOfYear, format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart';
import { MonthlyComparisonChart } from '@/components/statistics/monthly-comparison-chart';
import { ExpenseByCategoryChart } from '@/components/statistics/expense-by-category-chart';
import { IncomeVsExpenseChart } from '@/components/statistics/income-vs-expense-chart';
import { FinancialInsights } from '@/components/statistics/financial-insights';
import { YearFilter } from '@/components/statistics/year-filter';
import { formatCurrency, cn } from '@/lib/utils';

interface StatisticsPageProps {
    searchParams: Promise<{ year?: string }>;
}

export default async function StatisticsPage({ searchParams }: StatisticsPageProps) {
    const params = await searchParams;
    const year = params.year ? parseInt(params.year) : new Date().getFullYear();

    const yearStart = startOfYear(new Date(year, 0, 1));
    const yearEnd = endOfYear(new Date(year, 0, 1));

    const transactions = await prisma.transaction.findMany({
        where: { date: { gte: yearStart, lte: yearEnd } },
        include: { category: true },
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const monthTx = transactions.filter(t => t.date.getMonth() === i);
        const income = monthTx
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = monthTx
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            month: format(new Date(year, i, 1), 'MMM', { locale: localeId }),
            income,
            expense,
        };
    });

    const expenseTx = transactions.filter(t => t.type === 'EXPENSE');
    const categoryTotals = new Map<string, { name: string; total: number }>();
    for (const tx of expenseTx) {
        const existing = categoryTotals.get(tx.categoryId);
        if (existing) {
            existing.total += tx.amount;
        } else {
            categoryTotals.set(tx.categoryId, { name: tx.category.name, total: tx.amount });
        }
    }
    const expenseByCategory = Array.from(categoryTotals.values()).sort((a, b) => b.total - a.total);

    const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseTx.reduce((sum, t) => sum + t.amount, 0);
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    const insights: { icon: 'up' | 'down' | 'piggy' | 'warning'; text: string }[] = [];

    if (totalIncome > 0 || totalExpense > 0) {
        if (netSavings >= 0) {
            insights.push({
                icon: 'piggy',
                text: `Kamu berhasil menabung ${formatCurrency(netSavings)} (${savingsRate}% dari total pemasukan) sepanjang tahun ${year}.`,
            });
        } else {
            insights.push({
                icon: 'warning',
                text: `Pengeluaran kamu melebihi pemasukan sebesar ${formatCurrency(Math.abs(netSavings))} di tahun ${year}.`,
            });
        }
    }

    if (expenseByCategory.length > 0) {
        const top = expenseByCategory[0];
        const percent = totalExpense > 0 ? Math.round((top.total / totalExpense) * 100) : 0;
        insights.push({
            icon: 'down',
            text: `Kategori pengeluaran terbesar adalah "${top.name}" dengan total ${formatCurrency(top.total)} (${percent}% dari seluruh pengeluaran).`,
        });
    }

    const highestExpenseMonth = monthlyData.reduce(
        (max, m) => (m.expense > max.expense ? m : max),
        monthlyData[0],
    );
    if (highestExpenseMonth.expense > 0) {
        insights.push({
            icon: 'down',
            text: `Pengeluaran tertinggi terjadi pada bulan ${highestExpenseMonth.month} sebesar ${formatCurrency(highestExpenseMonth.expense)}.`,
        });
    }

    const highestIncomeMonth = monthlyData.reduce(
        (max, m) => (m.income > max.income ? m : max),
        monthlyData[0],
    );
    if (highestIncomeMonth.income > 0) {
        insights.push({
            icon: 'up',
            text: `Pemasukan tertinggi terjadi pada bulan ${highestIncomeMonth.month} sebesar ${formatCurrency(highestIncomeMonth.income)}.`,
        });
    }

    return (
        <div className="relative space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Statistik</h1>
                    <p className="text-sm text-muted-foreground">
                        Analisis cash flow dan kebiasaan keuangan kamu tahun {year}.
                    </p>
                </div>
                <YearFilter year={year} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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
                            Selisih Bersih
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={cn(
                                'text-2xl font-bold',
                                netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400',
                            )}
                        >
                            {formatCurrency(netSavings)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Cash Flow {year}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CashFlowChart data={monthlyData} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Perbandingan Bulanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MonthlyComparisonChart data={monthlyData} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pengeluaran per Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ExpenseByCategoryChart data={expenseByCategory} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <IncomeVsExpenseChart
                            totalIncome={totalIncome}
                            totalExpense={totalExpense}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Financial Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <FinancialInsights insights={insights} />
                </CardContent>
            </Card>
        </div>
    );
}
