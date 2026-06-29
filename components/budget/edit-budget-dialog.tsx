'use client';

import { BudgetForm } from '@/components/budget/budget-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BudgetWithCategory } from '@/lib/types';

interface EditBudgetDialogProps {
    budget: BudgetWithCategory;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditBudgetDialog({ budget, open, onOpenChange }: EditBudgetDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Budget</DialogTitle>
                </DialogHeader>
                <BudgetForm
                    categories={[]}
                    month={budget.month}
                    year={budget.year}
                    budgetId={budget.id}
                    categoryName={budget.category.name}
                    defaultValues={{
                        categoryId: budget.categoryId,
                        amount: budget.amount,
                        month: budget.month,
                        year: budget.year,
                    }}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
