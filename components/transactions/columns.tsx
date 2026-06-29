'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
    ArrowDown,
    ArrowDownLeft,
    ArrowUp,
    ArrowUpDown,
    ArrowUpRight,
    MoreHorizontal,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TransactionWithCategory } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';

interface ColumnsProps {
    onEdit: (transaction: TransactionWithCategory) => void;
    onDelete: (id: string) => void;
}

// Header yang bisa diklik untuk mengubah urutan sorting.
// Sorting sebenarnya (query ulang ke server) ditangani oleh parent lewat manualSorting.
function SortableHeader({
    label,
    column,
    align = 'left',
}: {
    label: string;
    column: Column<TransactionWithCategory, unknown>;
    align?: 'left' | 'right';
}) {
    const sorted = column.getIsSorted();

    return (
        <Button
            variant='ghost'
            size='sm'
            onClick={column.getToggleSortingHandler()}
            className={cn(
                'h-8 gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground',
                align === 'left' ? '-ml-2' : '-mr-2',
            )}
        >
            {label}
            {sorted === 'asc' ? (
                <ArrowUp className='h-3.5 w-3.5' />
            ) : sorted === 'desc' ? (
                <ArrowDown className='h-3.5 w-3.5' />
            ) : (
                <ArrowUpDown className='h-3.5 w-3.5 opacity-40' />
            )}
        </Button>
    );
}

export function getColumns({
    onEdit,
    onDelete,
}: ColumnsProps): ColumnDef<TransactionWithCategory>[] {
    return [
        {
            accessorKey: 'date',
            header: ({ column }) => <SortableHeader label='Tanggal' column={column} />,
            cell: ({ row }) =>
                format(row.original.date, 'd MMM yyyy', { locale: localeId }),
        },
        {
            accessorKey: 'category',
            header: ({ column }) => <SortableHeader label='Kategori' column={column} />,
            cell: ({ row }) => row.original.category.name,
        },
        {
            accessorKey: 'description',
            header: 'Catatan',
            enableSorting: false,
            cell: ({ row }) => (
                <span className='text-muted-foreground'>
                    {row.original.description || '-'}
                </span>
            ),
        },
        {
            accessorKey: 'type',
            header: 'Jenis',
            enableSorting: false,
            cell: ({ row }) => {
                const isIncome = row.original.type === 'INCOME';
                return (
                    <Badge
                        variant='outline'
                        className={cn(
                            'gap-1',
                            isIncome
                                ? 'border-emerald-500/40 text-emerald-400'
                                : 'border-rose-500/40 text-rose-400',
                        )}
                    >
                        {isIncome ? (
                            <ArrowUpRight className='h-3 w-3' />
                        ) : (
                            <ArrowDownLeft className='h-3 w-3' />
                        )}
                        {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => (
                <div className='text-right'>
                    <SortableHeader label='Jumlah' column={column} align='right' />
                </div>
            ),
            cell: ({ row }) => {
                const isIncome = row.original.type === 'INCOME';
                return (
                    <div
                        className={cn(
                            'text-right font-medium',
                            isIncome ? 'text-emerald-400' : 'text-rose-400',
                        )}
                    >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(row.original.amount)}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            enableSorting: false,
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem onSelect={() => onEdit(row.original)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={() => onDelete(row.original.id)}
                            className='text-rose-400'
                        >
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
}
