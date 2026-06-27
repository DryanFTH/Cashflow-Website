'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BudgetForm } from '@/components/budget/budget-form';
import type { Category } from '@/lib/generated/prisma/client';

interface BudgetDialogProps {
    categories: Category[];
    month: number;
    year: number;
}

export function BudgetDialog({ categories, month, year }: BudgetDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={categories.length === 0}
                    title={
                        categories.length === 0
                            ? 'Semua kategori sudah punya budget bulan ini'
                            : undefined
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Budget
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Budget</DialogTitle>
                </DialogHeader>
                <BudgetForm
                    categories={categories}
                    month={month}
                    year={year}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
