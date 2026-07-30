import { ReactNode } from "react";

interface AnalyticCardProps {
    title: string;
    value: string;
    icon?: ReactNode;
    description?: string;
}

export function AnalyticCard({ title, value, icon, description }: AnalyticCardProps) {
    return (
        <div
            className="w-full p-6 rounded-2xl border"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
            <div className="flex items-center gap-2.5 mb-3.5">
                <span
                    className="flex items-center justify-center shrink-0 rounded-lg w-9 h-9"
                    style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                >
                    {icon}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>{title}</span>
            </div>
            <p className="font-heading text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>{value}</p>
            {description && (
                <p className="text-xs" style={{ color: "var(--muted)" }}>{description}</p>
            )}
        </div>
    );
}