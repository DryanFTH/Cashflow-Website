import { z } from 'zod';

export const transactionSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']),
    amount: z.coerce.number().positive('Jumlah harus lebih dari 0'),
    categoryId: z.string().min(1, 'Kategori wajib dipilih'),
    date: z.coerce.date(),
    description: z.string().max(200, 'Maksimal 200 karakter').optional(),
});

export type TransactionFormInput = z.input<typeof transactionSchema>;
export type TransactionFormValues = z.output<typeof transactionSchema>;
