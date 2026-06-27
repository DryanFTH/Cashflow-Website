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
import { TransactionForm } from '@/components/transactions/transaction-form';
import type { Category } from '@/lib/generated/prisma/client';

export function TransactionDialog({ categories }: { categories: Category[] }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={categories.length === 0}
                    title={categories.length === 0 ? 'Buat kategori terlebih dahulu' : undefined}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Transaksi
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Transaksi</DialogTitle>
                </DialogHeader>
                <TransactionForm categories={categories} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
