"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/AdminHeader";
import { Footer } from "@/components/Footer";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSideBar } from "@/components/AdminSideBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
        <AdminHeader />
        <LoadingState label="Verificando acesso..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="flex h-full overflow-hidden">
        <AdminSideBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <Footer />
    </>
  );
}
