"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCategory } from "@/hooks/category/useCreateCategory";
import { useCategory } from "@/hooks/category/useCategory";
import { ApiError } from "@/utils/apiError";
import { Modal } from "@/components/Modal";

const categorySchema = z.object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    slug: z.string().trim().min(1, "Slug é obrigatório"),
    description: z.string().trim().min(1, "Descrição é obrigatória"),
    parentId: z.coerce.number({ message: "Selecione uma categoria pai" }).positive("Selecione uma categoria pai"),
});

type CategoryFormInput = z.input<typeof categorySchema>;
type CategoryFormValues = z.output<typeof categorySchema>;

export function CategoryForm() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: categories } = useCategory();
    const createCategory = useCreateCategory();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
        resolver: zodResolver(categorySchema),
    });

    async function onSubmit(values: CategoryFormValues) {
        try {
            await createCategory.mutateAsync(values);
            reset();
            setIsOpen(false);
        } catch (err) {
            setError("root", {
                message: err instanceof ApiError ? err.message : "Algo deu errado. Tente novamente.",
            });
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-full px-4 py-2.5 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-85 mt-10"
                style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
                Adicionar categoria
            </button>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <h1 className="font-heading text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Criar Categoria</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col" noValidate>
                        <div>
                            <input
                                type="text"
                                placeholder="Nome"
                                className="w-full rounded-lg border border-(--border) p-2.5 text-sm font-medium"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.name.message}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Slug"
                                className="w-full rounded-lg border border-(--border) p-2.5 text-sm font-medium"
                                {...register("slug")}
                            />
                            {errors.slug && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.slug.message}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Descrição"
                                className="w-full rounded-lg border border-(--border) p-2.5 text-sm font-medium"
                                {...register("description")}
                            />
                            {errors.description && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.description.message}</p>}
                        </div>

                        <div>
                            <select
                                defaultValue=""
                                className="w-full rounded-lg border border-(--border) p-2.5 text-sm font-medium"
                                style={{ background: "var(--card-bg)", color: "var(--text)" }}
                                {...register("parentId")}
                            >
                                <option value="" disabled>Selecione a categoria pai</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            {errors.parentId && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.parentId.message}</p>}
                        </div>

                        {errors.root && (
                            <div
                                role="alert"
                                className="rounded-lg border px-3.5 py-2.5 text-sm font-medium"
                                style={{ borderColor: "#f87171", color: "#dc2626", background: "rgba(220, 38, 38, 0.08)" }}
                            >
                                {errors.root.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-full px-4 py-2.5 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-85 disabled:opacity-60"
                            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                        >
                            {isSubmitting ? "Criando..." : "Criar Categoria"}
                        </button>
                    </form>
                </Modal>
            )}
        </>
    );
}
