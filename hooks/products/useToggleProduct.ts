import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export function useToggleProduct() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (productId: number) => api(`/product/toggle-product/${productId}`, { method: "PATCH" }, token ?? undefined),
        onSuccess: (_data, productId) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
        }
    })
}