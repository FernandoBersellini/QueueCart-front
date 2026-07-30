import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (productId: number) => api(`/product/delete-product/${productId}`, { method: "DELETE" }, token ?? undefined),
        onSuccess: (_data, productId) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.removeQueries({ queryKey: ["product", productId] });
        }
    })
}
