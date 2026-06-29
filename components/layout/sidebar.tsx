'use client';

import {
    ArrowLeftRight,
    BarChart3,
    FileText,
    LayoutDashboard,
    Tags,
    Wallet2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transaksi', icon: ArrowLeftRight },
    { href: '/categories', label: 'Kategori', icon: Tags },
    { href: '/statistics', label: 'Statistik', icon: BarChart3 },
    { href: '/budget', label: 'Budget', icon: Wallet2 },
    { href: '/reports', label: 'Laporan', icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className='hidden md:flex w-60 flex-col border-r border-border bg-card px-3 py-6'>
            <div className='px-3 mb-8'>
                <h1 className='text-lg font-semibold'>Cashflow</h1>
                <p className='text-xs text-muted-foreground'>Personal Finance</p>
            </div>
            <nav className='flex flex-col gap-1'>
                {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                            pathname === href && 'bg-accent text-foreground',
                        )}
                    >
                        <Icon className='h-4 w-4' />
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
