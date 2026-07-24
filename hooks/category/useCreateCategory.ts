import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryDTO } from "@/types/category";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCategory: CreateCategoryDTO) => api("/category/create-category", { method: "POST", body: JSON.stringify(newCategory) }, localStorage.getItem("token") ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  })
}
