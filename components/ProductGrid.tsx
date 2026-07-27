import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <>
      <div className="flex items-baseline justify-between px-6 pt-2 pb-1">
        <h3 className="text-xl">Selecionados para você</h3>
        <span className="text-[13px]" style={{ color: "var(--muted)" }}>
          Renovado a cada visita
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 px-6 pt-4 pb-12">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </>
  );
}
