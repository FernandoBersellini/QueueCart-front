import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";

export function useProduct(productId: number) {
    return useQuery({
        queryKey: ["product", productId],
        queryFn: () => api<Product>(`/product/product/${productId}`)
    })
}
