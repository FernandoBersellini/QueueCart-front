import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { api } from "@/utils/api";

export function useAddProductImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, url }: { productId: number; url: string }) => api<Product>(
            `/product/product/${productId}/images`,
            {
                method: "POST",
                body: JSON.stringify({ url }),
            },
            localStorage.getItem("token") ?? undefined
        ),
        onSuccess: (_data, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
        }
    })
}
