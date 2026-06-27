'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { transactionSchema, type TransactionFormValues } from '@/lib/validations/transaction';

type ActionResult = { success: true } | { success: false; error: string };

export async function createTransaction(values: TransactionFormValues): Promise<ActionResult> {
    const parsed = transactionSchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, error: 'Data yang dikirim tidak valid.' };
    }

    try {
        await prisma.transaction.create({ data: parsed.data });
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Gagal menyimpan transaksi.' };
    }

    revalidatePath('/transactions');
    revalidatePath('/');
    return { success: true };
}

export async function updateTransaction(
    id: string,
    values: TransactionFormValues,
): Promise<ActionResult> {
    const parsed = transactionSchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, error: 'Data yang dikirim tidak valid.' };
    }

    try {
        await prisma.transaction.update({ where: { id }, data: parsed.data });
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Gagal memperbarui transaksi.' };
    }

    revalidatePath('/transactions');
    revalidatePath('/');
    return { success: true };
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
    try {
        await prisma.transaction.delete({ where: { id } });
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Gagal menghapus transaksi.' };
    }

    revalidatePath('/transactions');
    revalidatePath('/');
    return { success: true };
}
