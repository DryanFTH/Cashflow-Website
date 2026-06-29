'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface YearFilterProps {
    year: number;
}

export function YearFilter({ year }: YearFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 4 + i);

    function updateYear(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('year', value);
        router.push(`/statistics?${params.toString()}`);
    }

    return (
        <Select value={String(year)} onValueChange={updateYear}>
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
    );
}
