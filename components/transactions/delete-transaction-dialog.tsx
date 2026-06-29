'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteTransaction } from '@/app/transactions/actions';
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

interface DeleteTransactionDialogProps {
    transactionId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteTransactionDialog({
    transactionId,
    open,
    onOpenChange,
}: DeleteTransactionDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteTransaction(transactionId);
        setIsDeleting(false);

        if (result.success) {
            toast.success('Transaksi dihapus');
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            onOpenChange(false);
        } else {
            toast.error(result.error);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus transaksi ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data transaksi akan dihapus
                        permanen.
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
