'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CategoryForm } from '@/components/categories/category-form';
import type { Category } from '@/lib/generated/prisma/client';

interface EditCategoryDialogProps {
    category: Category;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Kategori</DialogTitle>
                </DialogHeader>
                <CategoryForm
                    categoryId={category.id}
                    defaultValues={{
                        name: category.name,
                        type: category.type as 'INCOME' | 'EXPENSE',
                    }}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
