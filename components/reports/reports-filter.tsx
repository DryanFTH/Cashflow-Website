'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/lib/generated/prisma/client';

const MONTHS = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

interface ReportsFilterProps {
    year: string;
    month: string;
    categoryId: string;
    categories: Category[];
}

export function ReportsFilter({
    year,
    month,
    categoryId,
    categories,
}: ReportsFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 4 + i);

    function updateParam(key: 'year' | 'month' | 'categoryId', value: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        if (key === 'year' && value === 'all') {
            params.set('month', 'all');
        }
        router.push(`/reports?${params.toString()}`);
    }

    return (
        <div className='flex flex-wrap items-center gap-2'>
            <Select value={year} onValueChange={value => updateParam('year', value)}>
                <SelectTrigger className='w-27.5'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>Semua Tahun</SelectItem>
                    {years.map(y => (
                        <SelectItem key={y} value={String(y)}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={month}
                onValueChange={value => updateParam('month', value)}
                disabled={year === 'all'}
            >
                <SelectTrigger className='w-35'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>Semua Bulan</SelectItem>
                    {MONTHS.map((name, index) => (
                        <SelectItem key={name} value={String(index + 1)}>
                            {name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={categoryId}
                onValueChange={value => updateParam('categoryId', value)}
            >
                <SelectTrigger className='w-45'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>Semua Kategori</SelectItem>
                    {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name} (
                            {category.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
