'use server';

import { revalidatePath } from 'next/cache';

import { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { type BudgetFormValues, budgetSchema } from '@/lib/validations/budget';

type ActionResult = { success: true } | { success: false; error: string };

export async function createBudget(values: BudgetFormValues): Promise<ActionResult> {
    const parsed = budgetSchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, error: 'Data yang dikirim tidak valid.' };
    }

    try {
        await prisma.budget.create({ data: parsed.data });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return {
                success: false,
                error: 'Budget untuk kategori dan periode ini sudah ada.',
            };
        }
        console.error(error);
        return { success: false, error: 'Gagal menyimpan budget.' };
    }

    revalidatePath('/budget');
    revalidatePath('/');
    return { success: true };
}

export async function updateBudget(
    id: string,
    values: BudgetFormValues,
): Promise<ActionResult> {
    const parsed = budgetSchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, error: 'Data yang dikirim tidak valid.' };
    }

    try {
        await prisma.budget.update({ where: { id }, data: parsed.data });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return {
                success: false,
                error: 'Budget untuk kategori dan periode ini sudah ada.',
            };
        }
        console.error(error);
        return { success: false, error: 'Gagal memperbarui budget.' };
    }

    revalidatePath('/budget');
    revalidatePath('/');
    return { success: true };
}

export async function deleteBudget(id: string): Promise<ActionResult> {
    try {
        await prisma.budget.delete({ where: { id } });
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Gagal menghapus budget.' };
    }

    revalidatePath('/budget');
    revalidatePath('/');
    return { success: true };
}
