import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/ProductDetail";
import { getMockProductById } from "@/lib/mockProducts";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getMockProductById(Number(id));

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </>
  );
}
