import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetDialog } from '@/components/budget/budget-dialog';
import { BudgetList } from '@/components/budget/budget-list';
import { MonthYearFilter } from '@/components/budget/month-year-filter';
import { formatCurrency, cn } from '@/lib/utils';
import type { BudgetWithProgress } from '@/lib/types';

interface BudgetPageProps {
    searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function BudgetPage({ searchParams }: BudgetPageProps) {
    const params = await searchParams;
    const now = new Date();
    const month = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const year = params.year ? parseInt(params.year) : now.getFullYear();

    const categories = await prisma.category.findMany({
        where: { type: 'EXPENSE' },
        orderBy: { name: 'asc' },
    });

    const budgets = await prisma.budget.findMany({
        where: { month, year },
        include: { category: true },
        orderBy: { category: { name: 'asc' } },
    });

    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0, 23, 59, 59);

    const budgetsWithProgress: BudgetWithProgress[] = await Promise.all(
        budgets.map(async budget => {
            const result = await prisma.transaction.aggregate({
                where: {
                    categoryId: budget.categoryId,
                    type: 'EXPENSE',
                    date: { gte: periodStart, lte: periodEnd },
                },
                _sum: { amount: true },
            });

            const spent = result._sum.amount ?? 0;
            const percentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;

            return { ...budget, spent, percentage };
        }),
    );

    const totalBudget = budgetsWithProgress.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgetsWithProgress.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalBudget - totalSpent;

    const budgetedCategoryIds = new Set(budgets.map(b => b.categoryId));
    const availableCategories = categories.filter(c => !budgetedCategoryIds.has(c.id));

    return (
        <div className="relative space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Budget</h1>
                    <p className="text-sm text-muted-foreground">
                        Atur batas pengeluaran per kategori setiap bulan.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <MonthYearFilter month={month} year={year} />
                    <BudgetDialog categories={availableCategories} month={month} year={year} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Budget
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Terpakai
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-400">
                            {formatCurrency(totalSpent)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Sisa Budget
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={cn(
                                'text-2xl font-bold',
                                totalRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400',
                            )}
                        >
                            {formatCurrency(totalRemaining)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Budget per Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                    <BudgetList budgets={budgetsWithProgress} />
                </CardContent>
            </Card>
        </div>
    );
}
