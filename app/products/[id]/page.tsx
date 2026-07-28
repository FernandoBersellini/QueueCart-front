"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/ProductDetail";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useProduct } from "@/hooks/products/useProduct";
import { ApiError } from "@/utils/apiError";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading, isError, error } = useProduct(Number(id));

  if (isError && error instanceof ApiError && error.status === 404) {
    notFound();
  }

  return (
    <>
      <Header />
      {isLoading && <LoadingState label="Carregando produto..." />}
      {isError && <ErrorState message="Não foi possível carregar o produto." />}
      {product && <ProductDetail product={product} />}
      <Footer />
    </>
  );
}
