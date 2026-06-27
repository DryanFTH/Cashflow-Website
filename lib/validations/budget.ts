import { z } from 'zod';

export const budgetSchema = z.object({
    categoryId: z.string().min(1, 'Kategori wajib dipilih'),
    amount: z.coerce.number().positive('Jumlah harus lebih dari 0'),
    month: z.coerce.number().int().min(1).max(12),
    year: z.coerce.number().int().min(2000).max(2100),
});

export type BudgetFormInput = z.input<typeof budgetSchema>;
export type BudgetFormValues = z.output<typeof budgetSchema>;
