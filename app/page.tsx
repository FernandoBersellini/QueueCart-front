import { Header } from "@/components/Header";
import { PromoBanner } from "@/components/PromoBanner";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { mockProducts } from "@/lib/mockProducts";

export default function Home() {
  return (
    <>
      <Header />
      <PromoBanner />
      <ProductGrid products={mockProducts} />
      <Footer />
    </>
  );
}
