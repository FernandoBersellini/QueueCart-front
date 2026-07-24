import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { PageResponseDTO } from "@/types/pagination";

export function useProductsByCategory(categoryId: number, page = 0, size = 20) {
    return useQuery({
        queryKey: ["products", "category", categoryId, { page, size }],
        queryFn: () => api<PageResponseDTO<Product>>(`/product/product/category/${categoryId}?page=${page}&size=${size}`)
    })
}
