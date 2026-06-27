import { TrendingUp, TrendingDown, PiggyBank, AlertTriangle, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type InsightIcon = 'up' | 'down' | 'piggy' | 'warning';

interface Insight {
    icon: InsightIcon;
    text: string;
}

interface FinancialInsightsProps {
    insights: Insight[];
}

const ICON_MAP: Record<InsightIcon, { icon: LucideIcon; color: string }> = {
    up: { icon: TrendingUp, color: 'text-emerald-400' },
    down: { icon: TrendingDown, color: 'text-rose-400' },
    piggy: { icon: PiggyBank, color: 'text-emerald-400' },
    warning: { icon: AlertTriangle, color: 'text-amber-400' },
};

export function FinancialInsights({ insights }: FinancialInsightsProps) {
    if (insights.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted-foreground">
                Belum cukup data untuk menampilkan insight.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {insights.map((insight, index) => {
                const { icon: Icon, color } = ICON_MAP[insight.icon];
                return (
                    <div
                        key={index}
                        className="flex items-start gap-3 rounded-md border border-border p-3"
                    >
                        <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', color)} />
                        <p className="text-sm">{insight.text}</p>
                    </div>
                );
            })}
        </div>
    );
}
