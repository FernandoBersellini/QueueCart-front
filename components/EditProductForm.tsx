"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";
import { useCategory } from "@/hooks/category/useCategory";
import { ApiError } from "@/utils/apiError";
import { Modal } from "@/components/Modal";
import { Product } from "@/types/product";

const productSchema = z.object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    description: z.string().trim().min(1, "Descrição é obrigatória"),
    sku: z.string().trim().min(1, "SKU é obrigatório"),
    price: z.coerce.number({ message: "Preço é obrigatório" }).positive("Preço deve ser maior que zero"),
    categoryId: z.coerce.number({ message: "Selecione uma categoria" }).positive("Selecione uma categoria"),
});

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormValues = z.output<typeof productSchema>;

export function EditProductForm({ product, onClose }: { product: Product; onClose: () => void }) {
    const { data: categories } = useCategory();
    const updateProduct = useUpdateProduct();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormInput, unknown, ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            sku: product.sku,
            price: product.price,
            categoryId: product.categoryId,
        },
    });

    async function onSubmit(values: ProductFormValues) {
        try {
            await updateProduct.mutateAsync({ id: product.id, ...values });
            onClose();
        } catch (err) {
            setError("root", {
                message: err instanceof ApiError ? err.message : "Algo deu errado. Tente novamente.",
            });
        }
    }

    return (
        <Modal onClose={onClose}>
            <h1 className="font-heading text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Editar Produto</h1>
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
                        placeholder="Descrição"
                        className="w-full rounded-lg border border-(--border) p-2.5 text-sm font-medium"
                        {...register("description")}
                    />
                    {errors.description && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.description.message}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="SKU"
                        className="w-full rounded-lg border border-(--border) p-2.5 text-sm font-medium"
                        {...register("sku")}
                    />
                    {errors.sku && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.sku.message}</p>}
                </div>

                <div>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Preço"
                        className="w-full rounded-lg border border-(--border) p-2.5 text-sm font-medium"
                        {...register("price")}
                    />
                    {errors.price && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.price.message}</p>}
                </div>

                <div>
                    <select
                        className="w-full rounded-lg border border-(--border) p-2.5 text-sm font-medium"
                        style={{ background: "var(--card-bg)", color: "var(--text)" }}
                        {...register("categoryId")}
                    >
                        <option value="" disabled>Selecione a categoria</option>
                        {categories?.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.categoryId.message}</p>}
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
                    {isSubmitting ? "Salvando..." : "Salvar alterações"}
                </button>
            </form>
        </Modal>
    );
}
