import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export function useToggleCategory() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (categoryId: number) => api(`/category/toggle-category/${categoryId}`, {
            method: "PATCH"
        }, token ?? undefined),
        onSuccess: (_data, categoryId) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
        }
    })
}
