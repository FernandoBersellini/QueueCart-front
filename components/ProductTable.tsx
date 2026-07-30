"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/products/useProducts";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EditProductForm } from "@/components/EditProductForm";
import { Product } from "@/types/product";
import { useDeleteProduct } from "@/hooks/products/useDeleteProduct";

export function ProductTable() {
    const { data, isLoading, isError } = useProducts();
    const products = data?.content ?? [];
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

    const handleDelete = (productId: number) => {
        if (confirm("Tem certeza de que deseja deletar este produto?")) {
            deleteProduct(productId);
        }
    };

    return (
        <div>
            <h1 className="font-heading text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Gestão de Produtos</h1>

            {isLoading && <LoadingState label="Carregando produtos..." />}
            {isError && <ErrorState message="Não foi possível carregar os produtos." />}

            {!isLoading && !isError && (
                <table className="table-auto w-full text-left" style={{ borderColor: "var(--border)" }}>
                    <thead>
                        <tr className="border-b py-2.5" style={{ borderColor: "var(--border)" }}>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>SKU</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b py-2.5" style={{ borderColor: "var(--border)" }}>
                                <td className="py-2.5">{product.name}</td>
                                <td className="py-2.5">
                                    {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </td>
                                <td className="py-2.5">{product.sku}</td>
                                <td className="py-2.5">
                                    {product.active ? (
                                        <span className="text-green-500">Ativo</span>
                                    ) : (
                                        <span className="text-red-500">Inativo</span>
                                    )}
                                </td>
                                <td className="py-2.5 flex gap-2.5">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="text-sm font-medium cursor-pointer"
                                        style={{ color: "var(--muted)" }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={isDeleting}
                                        className="text-sm font-medium cursor-pointer"
                                        style={{ color: "var(--danger)" }}
                                    >
                                        {isDeleting ? "Deletando..." : "Deletar"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {editingProduct && (
                <EditProductForm product={editingProduct} onClose={() => setEditingProduct(null)} />
            )}
        </div>
    );
}