import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryId: number) => api(`/category/toggle-category/${categoryId}`, {
            method: "PATCH"
        }, localStorage.getItem("token") ?? undefined),
        onSuccess: (_data, categoryId) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
        }
    })
}
