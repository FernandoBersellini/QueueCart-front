"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  return (
    <>
      <Header />
      <AuthForm
        title="Criar conta"
        fields={[
          { name: "name", label: "Nome", type: "text", autoComplete: "name" },
          { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
          { name: "password", label: "Senha", type: "password", autoComplete: "new-password" },
        ]}
        submitLabel="Criar conta"
        pendingLabel="Criando conta..."
        onSubmit={async (values) => {
          await signUp({ name: values.name, email: values.email, password: values.password });
          router.push("/");
        }}
        footer={{ text: "Já tem uma conta?", linkLabel: "Entrar", href: "/login" }}
      />
      <Footer />
    </>
  );
}
