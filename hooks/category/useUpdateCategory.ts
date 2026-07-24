import { api } from "@/utils/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { UpdateCategoryDTO } from "@/types/category";

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updatedCategory: UpdateCategoryDTO) => api(`/category/update-category/${updatedCategory.id}`, {
            method: "PATCH",
            body: JSON.stringify(updatedCategory),
        }, localStorage.getItem("token") ?? undefined),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
        }
    })
}