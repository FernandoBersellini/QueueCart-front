import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types/category";

export function useCategory() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api<Category[]>("/category/all-categories")
  })
}
