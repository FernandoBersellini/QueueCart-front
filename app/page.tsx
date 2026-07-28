"use client";

import { Header } from "@/components/Header";
import { PromoBanner } from "@/components/PromoBanner";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useProducts } from "@/hooks/products/useProducts";

export default function Home() {
  const { data, isLoading, isError } = useProducts();

  return (
    <>
      <Header />
      <PromoBanner />
      {isLoading && <LoadingState label="Carregando produtos..." />}
      {isError && <ErrorState message="Não foi possível carregar os produtos." />}
      {data && <ProductGrid products={data.content} />}
      <Footer />
    </>
  );
}
