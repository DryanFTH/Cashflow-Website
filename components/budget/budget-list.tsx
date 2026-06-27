'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditBudgetDialog } from '@/components/budget/edit-budget-dialog';
import { DeleteBudgetDialog } from '@/components/budget/delete-budget-dialog';
import { formatCurrency, cn } from '@/lib/utils';
import type { BudgetWithProgress } from '@/lib/types';

interface BudgetListProps {
    budgets: BudgetWithProgress[];
}

export function BudgetList({ budgets }: BudgetListProps) {
    const [editingBudget, setEditingBudget] = useState<BudgetWithProgress | null>(null);
    const [deletingBudget, setDeletingBudget] = useState<BudgetWithProgress | null>(null);

    if (budgets.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada budget untuk periode ini.
            </p>
        );
    }

    return (
        <div className="space-y-5">
            {budgets.map(budget => {
                const isOver = budget.percentage > 100;
                const isWarning = budget.percentage >= 80 && budget.percentage <= 100;

                return (
                    <div key={budget.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{budget.category.name}</span>
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        'text-sm font-medium',
                                        isOver
                                            ? 'text-rose-400'
                                            : isWarning
                                              ? 'text-amber-400'
                                              : 'text-muted-foreground',
                                    )}
                                >
                                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => setEditingBudget(budget)}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={() => setDeletingBudget(budget)}
                                            className="text-rose-400"
                                        >
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <Progress
                            value={Math.min(budget.percentage, 100)}
                            className={cn(
                                'h-2',
                                isOver && '[&>div]:bg-rose-500',
                                isWarning && '[&>div]:bg-amber-500',
                                !isOver && !isWarning && '[&>div]:bg-emerald-500',
                            )}
                        />
                        <p className="text-xs text-muted-foreground">
                            {budget.percentage}% terpakai
                            {isOver &&
                                ` — melebihi budget ${formatCurrency(budget.spent - budget.amount)}`}
                        </p>
                    </div>
                );
            })}

            {editingBudget && (
                <EditBudgetDialog
                    budget={editingBudget}
                    open={Boolean(editingBudget)}
                    onOpenChange={open => !open && setEditingBudget(null)}
                />
            )}

            {deletingBudget && (
                <DeleteBudgetDialog
                    budgetId={deletingBudget.id}
                    categoryName={deletingBudget.category.name}
                    open={Boolean(deletingBudget)}
                    onOpenChange={open => !open && setDeletingBudget(null)}
                />
            )}
        </div>
    );
}
