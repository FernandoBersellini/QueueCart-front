import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: number) => api(`/product/toggle-product/${productId}`, { method: "PATCH" }, localStorage.getItem("token") ?? undefined),
        onSuccess: (_data, productId) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
        }
    })
}