import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(1, 'Nama kategori wajib diisi').max(40, 'Maksimal 40 karakter'),
    type: z.enum(['INCOME', 'EXPENSE']),
});

export type CategoryFormInput = z.input<typeof categorySchema>;
export type CategoryFormValues = z.output<typeof categorySchema>;
