import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartDTO } from "@/types/cart";

export function useRemoveCartItem(userId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: number) => api<CartDTO>(`/cart/remove-item/${userId}/${productId}`, {
            method: "DELETE"
        }, localStorage.getItem("token") ?? undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        }
    })
}
