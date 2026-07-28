export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div
      className="flex items-center justify-center px-6 py-16 text-sm"
      style={{ color: "var(--muted)" }}
    >
      {label}
    </div>
  );
}
