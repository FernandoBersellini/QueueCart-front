import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (categoryId: number) => api(`/category/delete-category/${categoryId}`, { method: "DELETE" }, token ?? undefined),
        onSuccess: (_data, categoryId) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.removeQueries({ queryKey: ["category", categoryId] });
        }
    })
}
