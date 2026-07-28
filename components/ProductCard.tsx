import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const coverImage = product.imageUrls[0];

  return (
    <div
      className="rounded-[14px] border overflow-hidden opacity-0"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--border)",
        transform: "translateY(14px)",
        animation: "dispatch 0.5s ease forwards",
        animationDelay: `${0.05 + index * 0.1}s`,
      }}
    >
      <Link href={`/products/${product.id}`}>
        {coverImage ? (
          <div className="relative aspect-square">
            <Image
              src={coverImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="aspect-square"
            style={{
              background: "linear-gradient(160deg, var(--primary) 0%, var(--secondary) 100%)",
              opacity: 0.85,
            }}
          />
        )}
      </Link>
      <div className="p-3.5">
        <Link href={`/products/${product.id}`}>
          <h4 className="text-sm font-medium mb-1">{product.name}</h4>
        </Link>
        <div className="text-[15px] font-semibold mb-2.5">{formatPrice(product.price)}</div>
        <button
          className="w-full rounded-lg border-none py-2.5 text-[13px] font-medium cursor-pointer"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
