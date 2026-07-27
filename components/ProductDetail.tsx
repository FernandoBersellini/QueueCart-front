"use client";

import { useState } from "react";
import { Product } from "@/types/product";

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  function decrement() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increment() {
    setQuantity((current) => current + 1);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 px-6 pt-8 pb-16">
      <div
        className="aspect-square rounded-[18px]"
        style={{ background: "linear-gradient(150deg, var(--primary) 0%, var(--accent) 100%)" }}
      />

      <div>
        <h1 className="text-[26px] mb-2.5 tracking-tight">{product.name}</h1>
        <div className="text-[22px] font-semibold mb-[18px]">{formatPrice(product.price)}</div>
        <p className="text-sm leading-[1.7] mb-6" style={{ color: "var(--muted)" }}>
          {product.description}
        </p>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={decrement}
              aria-label="Diminuir quantidade"
              className="border-none bg-transparent w-8 h-8 text-[15px] cursor-pointer"
              style={{ color: "var(--text)" }}
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              onClick={increment}
              aria-label="Aumentar quantidade"
              className="border-none bg-transparent w-8 h-8 text-[15px] cursor-pointer"
              style={{ color: "var(--text)" }}
            >
              +
            </button>
          </div>
        </div>

        <button
          className="rounded-[10px] border-none px-7 py-3.5 font-semibold text-sm cursor-pointer"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
