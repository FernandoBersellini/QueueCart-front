"use client";

import { useCartContext } from "@/contexts/CartContext";
import { CartItemRow } from "@/components/CartItemRow";
import { X } from "lucide-react";

interface CartSideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartSideBar({ isOpen, onClose }: CartSideBarProps) {
    const { cart, isLoading } = useCartContext();
    const hasItems = (cart?.items.length ?? 0) > 0;

    return (
        <>
            <div
                className="fixed inset-0 transition-opacity duration-300"
                style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none",
                    zIndex: 999,
                }}
                onClick={onClose}
            />

            <aside
                className={`fixed right-0 top-0 w-96 h-full border-l flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
                style={{ background: "var(--card-bg)", borderColor: "var(--border)", zIndex: 1000 }}
            >
                <div className="flex justify-between items-center px-6 py-4.5 border-b" style={{ borderColor: "var(--border)" }}>
                    <h2 className="font-heading text-lg font-bold" style={{ color: "var(--text)" }}>Carrinho</h2>
                    <button
                        onClick={onClose}
                        aria-label="Fechar carrinho"
                        className="flex items-center justify-center rounded-full w-8 h-8 cursor-pointer"
                        style={{ color: "var(--muted)" }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto px-6">
                    {isLoading && (
                        <p className="text-sm py-6" style={{ color: "var(--muted)" }}>Carregando carrinho...</p>
                    )}

                    {!isLoading && !hasItems && (
                        <p className="text-sm py-6" style={{ color: "var(--muted)" }}>
                            Seu carrinho está vazio.
                        </p>
                    )}

                    {!isLoading && hasItems && cart?.items.map((item) => (
                        <CartItemRow key={item.productId} productId={item.productId} quantity={item.quantity} />
                    ))}
                </div>

                <div className="px-6 py-4.5 border-t" style={{ borderColor: "var(--border)" }}>
                    <button
                        disabled={!hasItems}
                        className="w-full rounded-full py-2.5 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                    >
                        Finalizar compra
                    </button>
                </div>
            </aside>
        </>
    );
}
