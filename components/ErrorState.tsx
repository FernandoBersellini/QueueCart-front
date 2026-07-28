export function ErrorState({ message = "Algo deu errado. Tente novamente." }: { message?: string }) {
  return (
    <div
      className="flex items-center justify-center px-6 py-16 text-sm text-center"
      style={{ color: "var(--muted)" }}
    >
      {message}
    </div>
  );
}
