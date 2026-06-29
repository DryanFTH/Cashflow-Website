import { CategoryDialog } from '@/components/categories/category-dialog';
import { CategoryList } from '@/components/categories/category-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: { _count: { select: { transactions: true } } },
        orderBy: { name: 'asc' },
    });

    const incomeCategories = categories.filter(c => c.type === 'INCOME');
    const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

    return (
        <div className='relative space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight'>Kategori</h1>
                    <p className='text-sm text-muted-foreground'>
                        Kelola kategori pemasukan dan pengeluaran kamu.
                    </p>
                </div>
                <CategoryDialog />
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-emerald-400'>
                            Kategori Pemasukan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryList
                            categories={incomeCategories}
                            emptyMessage='Belum ada kategori pemasukan.'
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-rose-400'>
                            Kategori Pengeluaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryList
                            categories={expenseCategories}
                            emptyMessage='Belum ada kategori pengeluaran.'
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
