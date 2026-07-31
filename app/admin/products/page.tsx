import { AdminPageHeader } from "@/components/AdminPageHeader";
import { AnalyticCard } from "@/components/AnalyticCard";
import { ProductForm } from "@/components/ProductForm";
import { ProductTable } from "@/components/ProductTable";
import { ShoppingBag, CircleDollarSign, Package } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <>
      <AdminPageHeader
        title="Produtos"
        description="Gerencie os produtos cadastrados" // Adicione uma descrição se desejar
      />
      <div className="grid grid-cols-3 gap-y-10 gap-x-5 px-6">
        <AnalyticCard title="Total de Produtos" value="10" icon={<ShoppingBag size={20} />} description="Produtos cadastrados" />
        <AnalyticCard title="Valor total em estoque" value="10" icon={<CircleDollarSign size={20} />} description="Valor total em estoque" />
        <AnalyticCard title="Valor médio do estoque" value="10" icon={<CircleDollarSign size={20} />} description="Valor médio do estoque" />
        <AnalyticCard title="Produtos fora de estoque" value="10" icon={<Package size={20} />} description="Produtos fora de estoque" />
      </div>

      <div className="px-6 mt-10">
        <ProductTable />
      </div>

      <div className="px-6 mt-10">
        <ProductForm />
      </div>
    </>

  );
}
