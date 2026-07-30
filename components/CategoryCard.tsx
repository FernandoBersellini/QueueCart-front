import { Category } from "@/types/category";

interface CategoryCardProps extends Category {
    onEdit: () => void;
    onDelete: () => void;
    isDeleting?: boolean;
}

export function CategoryCard({ name, description, active, onEdit, onDelete, isDeleting }: CategoryCardProps) {
    return (
        <div
            className="w-full p-6 rounded-2xl border"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
            <p className="font-heading text-xl font-bold mb-2" style={{ color: "var(--text)" }}>{name}</p>
            <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>{description}</p>
            <div className="flex items-center justify-between">
                {active ? (
                    <span className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-600">
                        Ativo
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded bg-rose-100 text-rose-600">
                        Inativo
                    </span>
                )}
                <div className="flex gap-2.5">
                    <button
                        onClick={onEdit}
                        className="text-sm font-medium cursor-pointer"
                        style={{ color: "var(--muted)" }}
                    >
                        Editar
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="text-sm font-medium cursor-pointer"
                        style={{ color: "#dc2626" }}
                    >
                        {isDeleting ? "Deletando..." : "Deletar"}
                    </button>
                </div>
            </div>
        </div>
    )
}