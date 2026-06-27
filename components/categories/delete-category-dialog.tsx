'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
import { deleteCategory } from '@/app/categories/actions';

interface DeleteCategoryDialogProps {
    categoryId: string;
    categoryName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({
    categoryId,
    categoryName,
    open,
    onOpenChange,
}: DeleteCategoryDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteCategory(categoryId);
        setIsDeleting(false);

        if (result.success) {
            toast.success('Kategori dihapus');
            onOpenChange(false);
        } else {
            toast.error(result.error);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus kategori &quot;{categoryName}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Kategori yang masih dipakai oleh
                        transaksi tidak dapat dihapus.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
                    >
                        {isDeleting ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
