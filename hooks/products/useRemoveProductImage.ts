import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { api } from "@/utils/api";

export function useRemoveProductImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, imageId }: { productId: number; imageId: number }) => api<Product>(
            `/product/product/${productId}/images/${imageId}`,
            { method: "DELETE" },
            localStorage.getItem("token") ?? undefined
        ),
        onSuccess: (_data, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
        }
    })
}
