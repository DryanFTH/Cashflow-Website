'use server';

import { revalidatePath } from 'next/cache';

import { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { type CategoryFormValues, categorySchema } from '@/lib/validations/category';

type ActionResult = { success: true } | { success: false; error: string };

export async function createCategory(values: CategoryFormValues): Promise<ActionResult> {
    const parsed = categorySchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, error: 'Data yang dikirim tidak valid.' };
    }

    try {
        await prisma.category.create({ data: parsed.data });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return {
                success: false,
                error: 'Kategori dengan nama dan jenis ini sudah ada.',
            };
        }
        console.error(error);
        return { success: false, error: 'Gagal menyimpan kategori.' };
    }

    revalidatePath('/categories');
    revalidatePath('/transactions');
    revalidatePath('/');
    return { success: true };
}

export async function updateCategory(
    id: string,
    values: CategoryFormValues,
): Promise<ActionResult> {
    const parsed = categorySchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, error: 'Data yang dikirim tidak valid.' };
    }

    try {
        await prisma.category.update({ where: { id }, data: parsed.data });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return {
                success: false,
                error: 'Kategori dengan nama dan jenis ini sudah ada.',
            };
        }
        console.error(error);
        return { success: false, error: 'Gagal memperbarui kategori.' };
    }

    revalidatePath('/categories');
    revalidatePath('/transactions');
    revalidatePath('/');
    return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
    try {
        await prisma.category.delete({ where: { id } });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2003'
        ) {
            return {
                success: false,
                error: 'Kategori tidak bisa dihapus karena masih dipakai oleh transaksi.',
            };
        }
        console.error(error);
        return { success: false, error: 'Gagal menghapus kategori.' };
    }

    revalidatePath('/categories');
    revalidatePath('/transactions');
    revalidatePath('/');
    return { success: true };
}
