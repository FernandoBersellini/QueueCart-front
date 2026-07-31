"use client";

import { createContext, useContext, useState } from "react";
import { CartDTO } from "@/types/cart";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/cart/useCart";
import { useAddCartItem } from "@/hooks/cart/useAddCartItem";
import { useRemoveCartItem } from "@/hooks/cart/useRemoveCartItem";
import { useUpdateCartItem } from "@/hooks/cart/useUpdateCartItem";
import { useClearCart } from "@/hooks/cart/useClearCart";

interface CartState {
    cart: CartDTO | undefined;
    isLoading: boolean;
    addToCart: (productId: number, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    isOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const userId = user?.userId ?? 0;

    const [isOpen, setIsOpen] = useState(false);

    const { data: cart, isLoading } = useCart(userId);
    const addItem = useAddCartItem(userId);
    const removeItem = useRemoveCartItem(userId);
    const updateItem = useUpdateCartItem(userId);
    const clear = useClearCart(userId);

    function toggleCart() {
        setIsOpen((prev) => !prev);
    }

    function addToCart(productId: number, quantity = 1) {
        if (!user) return;
        addItem.mutate({ productId, quantity });
    }

    function removeFromCart(productId: number) {
        if (!user) return;
        removeItem.mutate(productId);
    }

    function updateQuantity(productId: number, quantity: number) {
        if (!user) return;
        updateItem.mutate({ productId, quantity });
    }

    function clearCart() {
        if (!user) return;
        clear.mutate();
    }

    return (
        <CartContext.Provider
            value={{ cart, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, isOpen, toggleCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return context;
}
