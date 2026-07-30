import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartDTO } from "@/types/cart";
import { useAuth } from "@/contexts/AuthContext";

export function useRemoveCartItem(userId: number) {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (productId: number) => api<CartDTO>(`/cart/remove-item/${userId}/${productId}`, {
            method: "DELETE"
        }, token ?? undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        }
    })
}
