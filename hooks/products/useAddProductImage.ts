import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export function useAddProductImage() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: ({ productId, url }: { productId: number; url: string }) => api<Product>(
            `/product/product/${productId}/images`,
            {
                method: "POST",
                body: JSON.stringify({ url }),
            },
            token ?? undefined
        ),
        onSuccess: (_data, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
        }
    })
}
