import type { Budget, Category, Transaction } from '@/lib/generated/prisma/client';

export type TransactionWithCategory = Transaction & {
    category: Category;
};

export type CategoryWithCount = Category & {
    _count: { transactions: number };
};

export type BudgetWithCategory = Budget & {
    category: Category;
};

export type BudgetWithProgress = BudgetWithCategory & {
    spent: number;
    percentage: number;
};

export type TransactionSortBy = 'date' | 'amount' | 'category' | 'type';
export type SortOrder = 'asc' | 'desc';

export interface GetTransactionsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: TransactionSortBy;
    sortOrder?: SortOrder;
}

export interface PaginatedTransactions {
    data: TransactionWithCategory[];
    totalCount: number;
    pageCount: number;
}
