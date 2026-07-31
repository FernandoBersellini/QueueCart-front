"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useProduct } from "@/hooks/products/useProduct";
import { useCartContext } from "@/contexts/CartContext";

function formatPrice(price: number) {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CartItemRow({ productId, quantity }: { productId: number; quantity: number }) {
    const { data: product, isLoading } = useProduct(productId);
    const { updateQuantity, removeFromCart } = useCartContext();

    if (isLoading || !product) {
        return (
            <div className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="w-14 h-14 rounded-lg shrink-0" style={{ background: "var(--border)" }} />
                <div className="flex-1 h-4 rounded" style={{ background: "var(--border)" }} />
            </div>
        );
    }

    const coverImage = product.imageUrls[0];

    return (
        <div className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0" style={{ background: "var(--border)" }}>
                {coverImage && (
                    <Image src={coverImage} alt={product.name} fill sizes="56px" className="object-cover" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{product.name}</p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{formatPrice(product.price)}</p>

                <div className="flex items-center gap-2 mt-1.5">
                    <button
                        onClick={() => updateQuantity(productId, quantity - 1)}
                        disabled={quantity <= 1}
                        aria-label="Diminuir quantidade"
                        className="flex items-center justify-center rounded-full border w-6 h-6 cursor-pointer disabled:opacity-40"
                        style={{ borderColor: "var(--border)", color: "var(--text)" }}
                    >
                        <Minus size={12} />
                    </button>
                    <span className="text-sm w-4 text-center" style={{ color: "var(--text)" }}>{quantity}</span>
                    <button
                        onClick={() => updateQuantity(productId, quantity + 1)}
                        aria-label="Aumentar quantidade"
                        className="flex items-center justify-center rounded-full border w-6 h-6 cursor-pointer"
                        style={{ borderColor: "var(--border)", color: "var(--text)" }}
                    >
                        <Plus size={12} />
                    </button>
                </div>
            </div>

            <button
                onClick={() => removeFromCart(productId)}
                aria-label="Remover item"
                className="flex items-center justify-center rounded-full w-8 h-8 shrink-0 cursor-pointer"
                style={{ color: "var(--muted)" }}
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
