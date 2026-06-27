import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { getTransactions } from './actions';

export default async function TransactionsPage() {
    const [transactions, categories] = await Promise.all([
        getTransactions({ page: 1, pageSize: 10 }),
        prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ]);

    return (
        <div className="relative space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Transaksi</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola seluruh pemasukan dan pengeluaran kamu.
                    </p>
                </div>
                <TransactionDialog categories={categories} />
            </div>

            {categories.length === 0 && (
                <p className="text-sm text-amber-400">
                    Kamu belum punya kategori. Buat kategori dulu (akan kita buat di langkah
                    selanjutnya) sebelum menambah transaksi.
                </p>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Transaksi</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionsTable
                        initialData={transactions}
                        categories={categories}
                        pageSize={10}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
