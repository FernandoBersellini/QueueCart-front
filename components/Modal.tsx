"use client";

import { ReactNode } from "react";

export function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl border p-6"
                style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
