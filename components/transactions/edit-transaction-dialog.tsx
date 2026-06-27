'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/transactions/transaction-form';
import type { Category } from '@/lib/generated/prisma/client';
import type { TransactionWithCategory } from '@/lib/types';

interface EditTransactionDialogProps {
    transaction: TransactionWithCategory;
    categories: Category[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({
    transaction,
    categories,
    open,
    onOpenChange,
}: EditTransactionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Transaksi</DialogTitle>
                </DialogHeader>
                <TransactionForm
                    categories={categories}
                    transactionId={transaction.id}
                    defaultValues={{
                        type: transaction.type as 'INCOME' | 'EXPENSE',
                        amount: transaction.amount,
                        categoryId: transaction.categoryId,
                        date: transaction.date,
                        description: transaction.description ?? '',
                    }}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
