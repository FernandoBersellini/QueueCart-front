import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export function useRemoveProductImage() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: ({ productId, imageId }: { productId: number; imageId: number }) => api<Product>(
            `/product/product/${productId}/images/${imageId}`,
            { method: "DELETE" },
            token ?? undefined
        ),
        onSuccess: (_data, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
        }
    })
}
