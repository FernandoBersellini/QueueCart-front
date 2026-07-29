export function AdminPageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="px-6 pt-8 pb-6">
      <h1 className="font-heading text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
        {title}
      </h1>
      {description && (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {description}
        </p>
      )}
    </div>
  );
}
