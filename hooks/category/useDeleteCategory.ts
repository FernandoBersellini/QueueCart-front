import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryId: number) => api(`/category/delete-category/${categoryId}`, { method: "DELETE" }, localStorage.getItem("token") ?? undefined),
        onSuccess: (_data, categoryId) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.removeQueries({ queryKey: ["category", categoryId] });
        }
    })
}
