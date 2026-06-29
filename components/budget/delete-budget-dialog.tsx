'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { deleteBudget } from '@/app/budget/actions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteBudgetDialogProps {
    budgetId: string;
    categoryName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteBudgetDialog({
    budgetId,
    categoryName,
    open,
    onOpenChange,
}: DeleteBudgetDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteBudget(budgetId);
        setIsDeleting(false);

        if (result.success) {
            toast.success('Budget dihapus');
            onOpenChange(false);
        } else {
            toast.error(result.error);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Hapus budget &quot;{categoryName}&quot;?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data budget untuk kategori dan
                        periode ini akan dihapus permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className='bg-rose-600 hover:bg-rose-700 focus:ring-rose-600'
                    >
                        {isDeleting ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
