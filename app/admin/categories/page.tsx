import { AdminPageHeader } from "@/components/AdminPageHeader";
import { AnalyticCard } from "@/components/AnalyticCard";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function AdminCategoriesPage() {
  return (
    <>
      <AdminPageHeader
        title="Categorias"
        description="Gestão de categorias via UI ainda não implementada — use a API (Swagger/Postman) por enquanto."
      />
      <div className="grid grid-cols-3 gap-5">
        <AnalyticCard title="Total de Categorias" value="10" />
        <AnalyticCard title="Total de Categorias" value="10" />
        <AnalyticCard title="Total de Categorias" value="10" />
      </div>

      <CategoryGrid />

    </>
  );
}
