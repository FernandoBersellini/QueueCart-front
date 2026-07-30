import { api } from "@/utils/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { UpdateCategoryDTO } from "@/types/category";
import { useAuth } from "@/contexts/AuthContext";

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (updatedCategory: UpdateCategoryDTO) => api(`/category/update-category/${updatedCategory.id}`, {
            method: "PATCH",
            body: JSON.stringify(updatedCategory),
        }, token ?? undefined),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
        }
    })
}