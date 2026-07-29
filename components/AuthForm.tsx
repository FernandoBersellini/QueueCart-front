"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ApiError } from "@/utils/apiError";

interface AuthFormField {
  name: string;
  label: string;
  type: string;
  autoComplete?: string;
}

interface AuthFormProps {
  title: string;
  fields: AuthFormField[];
  submitLabel: string;
  pendingLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  footer: { text: string; linkLabel: string; href: string };
  hint?: string;
}

export function AuthForm({ title, fields, submitLabel, pendingLabel, onSubmit, footer, hint }: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-6 py-16">
      <div
        className="w-full rounded-2xl border p-8"
        style={{ maxWidth: 400, background: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <h1 className="font-heading text-xl font-bold mb-6" style={{ color: "var(--text)" }}>
          {title}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => {
            const isPassword = field.type === "password";
            const isVisible = visiblePasswords[field.name] ?? false;

            return (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label htmlFor={field.name} className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={field.name}
                    name={field.name}
                    type={isPassword && isVisible ? "text" : field.type}
                    autoComplete={field.autoComplete}
                    required
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none"
                    style={{
                      background: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                      paddingRight: isPassword ? 40 : undefined,
                    }}
                  />
                  {isPassword && (
                    <button
                      type="button"
                      onClick={() =>
                        setVisiblePasswords((prev) => ({ ...prev, [field.name]: !prev[field.name] }))
                      }
                      aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
                      aria-pressed={isVisible}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
                      style={{ color: "var(--muted)" }}
                    >
                      {isVisible ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-3.22 4.44M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {error && (
            <div
              role="alert"
              className="rounded-lg border px-3.5 py-2.5 text-sm font-medium"
              style={{ borderColor: "#f87171", color: "#dc2626", background: "rgba(220, 38, 38, 0.08)" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-full py-2.5 text-sm font-semibold cursor-pointer disabled:opacity-60"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {isSubmitting ? pendingLabel : submitLabel}
          </button>
        </form>

        <p className="mt-6 text-sm text-center" style={{ color: "var(--muted)" }}>
          {footer.text}{" "}
          <Link href={footer.href} className="font-medium" style={{ color: "var(--primary)" }}>
            {footer.linkLabel}
          </Link>
        </p>

        {hint && (
          <p className="mt-2 text-sm text-center" style={{ color: "var(--muted)" }}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
