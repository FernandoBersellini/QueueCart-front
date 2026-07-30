"use client"

import { useState } from "react";
import { useCategory } from "@/hooks/category/useCategory";
import { useDeleteCategory } from "@/hooks/category/useDeleteCategory";
import { CategoryCard } from "./CategoryCard";
import { CategoryForm } from "./CategoryForm";
import { EditCategoryForm } from "./EditCategoryForm";
import { Category } from "@/types/category";

export function CategoryGrid() {
    const { data: categories } = useCategory();
    const { mutate: deleteCategory, isPending: isDeleting, variables: deletingId } = useDeleteCategory();
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    function handleDelete(categoryId: number) {
        if (confirm("Tem certeza de que deseja deletar esta categoria?")) {
            deleteCategory(categoryId);
        }
    }

    return (
        <>
            <div className="grid grid-cols-4 gap-5 mt-10">
                {categories?.map((category) => (
                    <CategoryCard
                        key={category.id}
                        {...category}
                        onEdit={() => setEditingCategory(category)}
                        onDelete={() => handleDelete(category.id)}
                        isDeleting={isDeleting && deletingId === category.id}
                    />
                ))}
            </div>

            <CategoryForm />

            {editingCategory && (
                <EditCategoryForm category={editingCategory} onClose={() => setEditingCategory(null)} />
            )}
        </>
    )
}