'use server';

import { revalidatePath } from 'next/cache';

import { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import {
    GetTransactionsParams,
    PaginatedTransactions,
    SortOrder,
    TransactionSortBy,
} from '@/lib/types';
import {
    type TransactionFormValues,
    transactionSchema,
} from '@/lib/validations/transaction';

type ActionResult = { success: true } | { success: false; error: string };

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

function buildOrderBy(
    sortBy: TransactionSortBy,
    sortOrder: SortOrder,
): Prisma.TransactionOrderByWithRelationInput {
    switch (sortBy) {
        case 'category':
            return { category: { name: sortOrder } };
        case 'amount':
            return { amount: sortOrder };
        case 'type':
            return { type: sortOrder };
        case 'date':
        default:
            return { date: sortOrder };
    }
}

export async function getTransactions({
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    search = '',
    sortBy = 'date',
    sortOrder = 'desc',
}: GetTransactionsParams = {}): Promise<PaginatedTransactions> {
    const safePage = Math.max(1, Math.trunc(page));
    const safePageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(pageSize)));
    const keyword = search.trim();

    const where: Prisma.TransactionWhereInput = keyword
        ? {
              OR: [
                  { description: { contains: keyword } },
                  { category: { name: { contains: keyword } } },
              ],
          }
        : {};

    const orderBy = buildOrderBy(sortBy, sortOrder);

    const [data, totalCount] = await Promise.all([
        prisma.transaction.findMany({
            where,
            include: { category: true },
            orderBy,
            skip: (safePage - 1) * safePageSize,
            take: safePageSize,
        }),
        prisma.transaction.count({ where }),
    ]);

    return {
        data,
        totalCount,
        pageCount: Math.max(1, Math.ceil(totalCount / safePageSize)),
    };
}

export async function createTransaction(
    values: TransactionFormValues,
): Promise<ActionResult> {
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
