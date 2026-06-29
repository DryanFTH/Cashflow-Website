'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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

interface MonthYearFilterProps {
    month: number;
    year: number;
}

export function MonthYearFilter({ month, year }: MonthYearFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    function updateParam(key: 'month' | 'year', value: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        router.push(`/budget?${params.toString()}`);
    }

    return (
        <div className='flex items-center gap-2'>
            <Select
                value={String(month)}
                onValueChange={value => updateParam('month', value)}
            >
                <SelectTrigger className='w-35'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {MONTHS.map((name, index) => (
                        <SelectItem key={name} value={String(index + 1)}>
                            {name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                value={String(year)}
                onValueChange={value => updateParam('year', value)}
            >
                <SelectTrigger className='w-25'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {years.map(y => (
                        <SelectItem key={y} value={String(y)}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
