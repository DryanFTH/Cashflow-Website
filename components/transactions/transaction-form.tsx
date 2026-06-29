'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createTransaction, updateTransaction } from '@/app/transactions/actions';
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
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/lib/generated/prisma/client';
import { cn } from '@/lib/utils';
import {
    TransactionFormInput,
    type TransactionFormValues,
    transactionSchema,
} from '@/lib/validations/transaction';

interface TransactionFormProps {
    categories: Category[];
    transactionId?: string;
    defaultValues?: Partial<TransactionFormValues>;
    onSuccess?: () => void;
}

export function TransactionForm({
    categories,
    transactionId,
    defaultValues,
    onSuccess,
}: TransactionFormProps) {
    const isEdit = Boolean(transactionId);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: defaultValues?.type ?? 'EXPENSE',
            amount: defaultValues?.amount,
            categoryId: defaultValues?.categoryId ?? '',
            date: defaultValues?.date ?? new Date(),
            description: defaultValues?.description ?? '',
        },
    });

    const selectedType = watch('type');
    const filteredCategories = categories.filter(c => c.type === selectedType);

    async function onSubmit(values: TransactionFormValues) {
        const result = isEdit
            ? await updateTransaction(transactionId!, values)
            : await createTransaction(values);

        if (result.success) {
            toast.success(isEdit ? 'Transaksi diperbarui' : 'Transaksi ditambahkan');
            // Tabel transaksi disuplai oleh TanStack Query (server-side pagination),
            // jadi cache-nya perlu di-invalidate manual setelah create/update.
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
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
                    onClick={() => {
                        setValue('type', 'EXPENSE');
                        setValue('categoryId', '');
                    }}
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
                    onClick={() => {
                        setValue('type', 'INCOME');
                        setValue('categoryId', '');
                    }}
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
                <Label htmlFor='amount'>Jumlah</Label>
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

            <div className='space-y-2'>
                <Label htmlFor='categoryId'>Kategori</Label>
                <Controller
                    control={control}
                    name='categoryId'
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id='categoryId'>
                                <SelectValue placeholder='Pilih kategori' />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredCategories.length === 0 ? (
                                    <div className='px-3 py-2 text-sm text-muted-foreground'>
                                        Belum ada kategori{' '}
                                        {selectedType === 'INCOME'
                                            ? 'pemasukan'
                                            : 'pengeluaran'}
                                    </div>
                                ) : (
                                    filteredCategories.map(category => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.categoryId && (
                    <p className='text-xs text-rose-400'>{errors.categoryId.message}</p>
                )}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='date'>Tanggal</Label>
                <Input
                    id='date'
                    type='date'
                    defaultValue={format(defaultValues?.date ?? new Date(), 'yyyy-MM-dd')}
                    onChange={e => {
                        if (!(e.target instanceof HTMLInputElement)) return;

                        setValue('date', new Date(e.target.value));
                    }}
                />
                {errors.date && (
                    <p className='text-xs text-rose-400'>{errors.date.message}</p>
                )}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='description'>Catatan (opsional)</Label>
                <Textarea
                    id='description'
                    placeholder='Contoh: Makan siang bersama tim'
                    {...register('description')}
                />
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting
                    ? 'Menyimpan...'
                    : isEdit
                      ? 'Simpan Perubahan'
                      : 'Tambah Transaksi'}
            </Button>
        </form>
    );
}
