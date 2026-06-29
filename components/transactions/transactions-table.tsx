'use client';

import { useEffect, useMemo, useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
    PaginationState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Loader2, Search } from 'lucide-react';

import { getTransactions } from '@/app/transactions/actions';
import { getColumns } from '@/components/transactions/columns';
import { DeleteTransactionDialog } from '@/components/transactions/delete-transaction-dialog';
import { EditTransactionDialog } from '@/components/transactions/edit-transaction-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Category } from '@/lib/generated/prisma/client';
import type {
    PaginatedTransactions,
    SortOrder,
    TransactionSortBy,
    TransactionWithCategory,
} from '@/lib/types';

interface TransactionsTableProps {
    initialData: PaginatedTransactions;
    categories: Category[];
    pageSize?: number;
}

export function TransactionsTable({
    initialData,
    categories,
    pageSize = 10,
}: TransactionsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize,
    });
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebouncedValue(search, 350);

    const [editingTransaction, setEditingTransaction] =
        useState<TransactionWithCategory | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        setPagination(prev => (prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }));
    }, [debouncedSearch]);

    const activeSort = sorting[0];
    const sortBy: TransactionSortBy = (activeSort?.id as TransactionSortBy) ?? 'date';
    const sortOrder: SortOrder = activeSort?.desc === false ? 'asc' : 'desc';

    const isDefaultQuery =
        pagination.pageIndex === 0 &&
        pagination.pageSize === pageSize &&
        sortBy === 'date' &&
        sortOrder === 'desc' &&
        debouncedSearch === '';

    const { data, isFetching, isError } = useQuery({
        queryKey: [
            'transactions',
            pagination.pageIndex,
            pagination.pageSize,
            sortBy,
            sortOrder,
            debouncedSearch,
        ] as const,
        queryFn: () =>
            getTransactions({
                page: pagination.pageIndex + 1,
                pageSize: pagination.pageSize,
                search: debouncedSearch,
                sortBy,
                sortOrder,
            }),
        initialData: isDefaultQuery ? initialData : undefined,
        // Tetap tampilkan data halaman lama selagi halaman baru di-fetch,
        // jadi tabel tidak "berkedip" kosong saat pindah halaman/sort/cari.
        placeholderData: keepPreviousData,
    });

    const rows = data?.data ?? [];
    const totalCount = data?.totalCount ?? 0;
    const pageCount = data?.pageCount ?? 1;

    const columns = getColumns({
        onEdit: setEditingTransaction,
        onDelete: setDeletingId,
    });

    const table = useReactTable({
        data: rows,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        manualSorting: true,
        manualPagination: true,
        enableMultiSort: false,
        pageCount,
        getCoreRowModel: getCoreRowModel(),
    });

    const from = totalCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
    const to = Math.min(totalCount, (pagination.pageIndex + 1) * pagination.pageSize);

    return (
        <div className='space-y-4'>
            <div className='relative max-w-sm'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                    placeholder='Cari kategori atau catatan...'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className='pl-9 pr-9'
                />
                {isFetching && (
                    <Loader2 className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground' />
                )}
            </div>

            <div className='rounded-md border border-border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody
                        className={
                            isFetching
                                ? 'opacity-60 transition-opacity'
                                : 'transition-opacity'
                        }
                    >
                        {isError ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center text-rose-400'
                                >
                                    Gagal memuat transaksi. Coba muat ulang halaman.
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center text-muted-foreground'
                                >
                                    {debouncedSearch
                                        ? 'Tidak ada transaksi yang cocok.'
                                        : 'Belum ada transaksi.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground'>
                    {totalCount === 0
                        ? 'Tidak ada transaksi'
                        : `Menampilkan ${from}-${to} dari ${totalCount} transaksi`}
                </p>
                <div className='flex gap-2'>
                    <p className='text-sm text-muted-foreground'>
                        Halaman {pagination.pageIndex + 1} dari {pageCount}
                    </p>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Selanjutnya
                    </Button>
                </div>
            </div>

            {editingTransaction && (
                <EditTransactionDialog
                    transaction={editingTransaction}
                    categories={categories}
                    open={Boolean(editingTransaction)}
                    onOpenChange={open => !open && setEditingTransaction(null)}
                />
            )}

            <DeleteTransactionDialog
                transactionId={deletingId ?? ''}
                open={Boolean(deletingId)}
                onOpenChange={open => !open && setDeletingId(null)}
            />
        </div>
    );
}
