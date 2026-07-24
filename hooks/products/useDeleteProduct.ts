import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: number) => api(`/product/delete-product/${productId}`, { method: "DELETE" }, localStorage.getItem("token") ?? undefined),
        onSuccess: (_data, productId) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.removeQueries({ queryKey: ["product", productId] });
        }
    })
}
