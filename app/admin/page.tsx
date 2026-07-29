"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (isReady && user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isReady, user, router]);

  if (!isReady || user?.role !== "ADMIN") {
    return (
      <>
        <Header />
        <LoadingState label="Verificando acesso..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="px-6 py-16" style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h1 className="font-heading text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
          Painel administrativo
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Olá, {user.name}. A gestão de produtos e categorias ainda é feita direto pela API
          (Swagger/Postman) — esta área é só o ponto de entrada reservado para admins.
        </p>
      </div>
      <Footer />
    </>
  );
}
