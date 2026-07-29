"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  return (
    <>
      <Header />
      <AuthForm
        title="Entrar"
        fields={[
          { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
          { name: "password", label: "Senha", type: "password", autoComplete: "current-password" },
        ]}
        submitLabel="Entrar"
        pendingLabel="Entrando..."
        onSubmit={async (values) => {
          await signIn({ email: values.email, password: values.password });
          router.push("/");
        }}
        footer={{ text: "Não tem uma conta?", linkLabel: "Cadastre-se", href: "/register" }}
        hint="É admin? Entre aqui com suas credenciais de administrador."
      />
      <Footer />
    </>
  );
}
