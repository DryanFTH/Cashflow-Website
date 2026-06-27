'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useMemo } from 'react';

const COLORS = [
    '#f43f5e',
    '#fb923c',
    '#facc15',
    '#a3e635',
    '#34d399',
    '#22d3ee',
    '#60a5fa',
    '#a78bfa',
    '#f472b6',
    '#94a3b8',
];

interface ExpenseByCategoryChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

export function ExpenseByCategoryChart({ data }: ExpenseByCategoryChartProps) {
    if (data.length === 0) {
        return (
            <p className="py-12 text-center text-sm text-muted-foreground">
                Belum ada data pengeluaran untuk periode ini.
            </p>
        );
    }

    const chartData = useMemo(
        () =>
            data.map((item, index) => ({
                ...item,
                fill: COLORS[index % COLORS.length],
            })),
        [data],
    );

    return (
        <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                    }}
                    formatter={value => {
                        if (typeof value !== 'number') {
                            return '';
                        }

                        return formatCurrency(value);
                    }}
                />
                <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: '12px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
