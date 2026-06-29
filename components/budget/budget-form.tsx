'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createBudget, updateBudget } from '@/app/budget/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/lib/generated/prisma/client';
import {
    type BudgetFormInput,
    type BudgetFormValues,
    budgetSchema,
} from '@/lib/validations/budget';

interface BudgetFormProps {
    categories: Category[];
    month: number;
    year: number;
    budgetId?: string;
    categoryName?: string;
    defaultValues?: Partial<BudgetFormValues>;
    onSuccess?: () => void;
}

export function BudgetForm({
    categories,
    month,
    year,
    budgetId,
    categoryName,
    defaultValues,
    onSuccess,
}: BudgetFormProps) {
    const isEdit = Boolean(budgetId);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BudgetFormInput, unknown, BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            categoryId: defaultValues?.categoryId ?? '',
            amount: defaultValues?.amount,
            month: defaultValues?.month ?? month,
            year: defaultValues?.year ?? year,
        },
    });

    const selectedCategoryId = watch('categoryId');

    async function onSubmit(values: BudgetFormValues) {
        const result = isEdit
            ? await updateBudget(budgetId!, values)
            : await createBudget(values);

        if (result.success) {
            toast.success(isEdit ? 'Budget diperbarui' : 'Budget ditambahkan');
            onSuccess?.();
        } else {
            toast.error(result.error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
                <Label htmlFor='categoryId'>Kategori</Label>
                {isEdit ? (
                    <Input value={categoryName} disabled />
                ) : (
                    <Select
                        value={selectedCategoryId}
                        onValueChange={value => setValue('categoryId', value)}
                    >
                        <SelectTrigger id='categoryId'>
                            <SelectValue placeholder='Pilih kategori' />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.length === 0 ? (
                                <div className='px-3 py-2 text-sm text-muted-foreground'>
                                    Semua kategori sudah punya budget bulan ini
                                </div>
                            ) : (
                                categories.map(category => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                )}
                {errors.categoryId && (
                    <p className='text-xs text-rose-400'>{errors.categoryId.message}</p>
                )}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='amount'>Jumlah Budget</Label>
                <Input
                    id='amount'
                    type='number'
                    step='any'
                    placeholder='0'
                    {...register('amount')}
                />
                {errors.amount && (
                    <p className='text-xs text-rose-400'>{errors.amount.message}</p>
                )}
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting
                    ? 'Menyimpan...'
                    : isEdit
                      ? 'Simpan Perubahan'
                      : 'Tambah Budget'}
            </Button>
        </form>
    );
}
