import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartDTO } from "@/types/cart";
import { useAuth } from "@/contexts/AuthContext";

export function useClearCart(userId: number) {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: () => api<CartDTO>(`/cart/clear-cart/${userId}`, {
            method: "DELETE"
        }, token ?? undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        }
    })
}
