'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditCategoryDialog } from '@/components/categories/edit-category-dialog';
import { DeleteCategoryDialog } from '@/components/categories/delete-category-dialog';
import type { CategoryWithCount } from '@/lib/types';

interface CategoryListProps {
    categories: CategoryWithCount[];
    emptyMessage: string;
}

export function CategoryList({ categories, emptyMessage }: CategoryListProps) {
    const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<CategoryWithCount | null>(null);

    if (categories.length === 0) {
        return <p className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
    }

    return (
        <div className="space-y-1">
            {categories.map(category => (
                <div
                    key={category.id}
                    className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-accent"
                >
                    <span className="text-sm font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-muted-foreground">
                            {category._count.transactions} transaksi
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => setEditingCategory(category)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => setDeletingCategory(category)}
                                    className="text-rose-400"
                                >
                                    Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ))}

            {editingCategory && (
                <EditCategoryDialog
                    category={editingCategory}
                    open={Boolean(editingCategory)}
                    onOpenChange={open => !open && setEditingCategory(null)}
                />
            )}

            {deletingCategory && (
                <DeleteCategoryDialog
                    categoryId={deletingCategory.id}
                    categoryName={deletingCategory.name}
                    open={Boolean(deletingCategory)}
                    onOpenChange={open => !open && setDeletingCategory(null)}
                />
            )}
        </div>
    );
}
