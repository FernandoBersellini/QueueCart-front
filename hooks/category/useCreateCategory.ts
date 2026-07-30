import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryDTO } from "@/types/category";
import { useAuth } from "@/contexts/AuthContext";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (newCategory: CreateCategoryDTO) => api("/category/create-category", { method: "POST", body: JSON.stringify(newCategory) }, token ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  })
}
