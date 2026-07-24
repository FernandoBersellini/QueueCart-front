import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { PageResponseDTO } from "@/types/pagination";

export function useProducts(page = 0, size = 20) {
    return useQuery({
        queryKey: ["products", { page, size }],
        queryFn: () => api<PageResponseDTO<Product>>(`/product/all-products?page=${page}&size=${size}`)
    })
}
