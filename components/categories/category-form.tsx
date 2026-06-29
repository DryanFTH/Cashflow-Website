'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createCategory, updateCategory } from '@/app/categories/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    CategoryFormInput,
    type CategoryFormValues,
    categorySchema,
} from '@/lib/validations/category';

interface CategoryFormProps {
    categoryId?: string;
    defaultValues?: Partial<CategoryFormValues>;
    onSuccess?: () => void;
}

export function CategoryForm({
    categoryId,
    defaultValues,
    onSuccess,
}: CategoryFormProps) {
    const isEdit = Boolean(categoryId);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: defaultValues?.name ?? '',
            type: defaultValues?.type ?? 'EXPENSE',
        },
    });

    const selectedType = watch('type');

    async function onSubmit(values: CategoryFormValues) {
        const result = isEdit
            ? await updateCategory(categoryId!, values)
            : await createCategory(values);

        if (result.success) {
            toast.success(isEdit ? 'Kategori diperbarui' : 'Kategori ditambahkan');
            onSuccess?.();
        } else {
            toast.error(result.error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
                <button
                    type='button'
                    onClick={() => setValue('type', 'EXPENSE')}
                    className={cn(
                        'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                        selectedType === 'EXPENSE'
                            ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                            : 'border-border text-muted-foreground hover:bg-accent',
                    )}
                >
                    Pengeluaran
                </button>
                <button
                    type='button'
                    onClick={() => setValue('type', 'INCOME')}
                    className={cn(
                        'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                        selectedType === 'INCOME'
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                            : 'border-border text-muted-foreground hover:bg-accent',
                    )}
                >
                    Pemasukan
                </button>
            </div>

            <div className='space-y-2'>
                <Label htmlFor='name'>Nama Kategori</Label>
                <Input
                    id='name'
                    placeholder='Contoh: Makanan, Gaji, Transportasi'
                    {...register('name')}
                />
                {errors.name && (
                    <p className='text-xs text-rose-400'>{errors.name.message}</p>
                )}
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting
                    ? 'Menyimpan...'
                    : isEdit
                      ? 'Simpan Perubahan'
                      : 'Tambah Kategori'}
            </Button>
        </form>
    );
}
