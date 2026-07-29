"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader } from "@/components/AdminPageHeader";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <AdminPageHeader
      title="Painel administrativo"
      description={`Olá, ${user?.name}. A gestão de produtos e categorias ainda é feita direto pela API (Swagger/Postman) — esta área é só o ponto de entrada reservado para admins.`}
    />
  );
}
