'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import { CategoryForm } from '@/components/categories/category-form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export function CategoryDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Tambah Kategori
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Kategori</DialogTitle>
                </DialogHeader>
                <CategoryForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
