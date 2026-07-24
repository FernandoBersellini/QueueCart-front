import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartDTO } from "@/types/cart";

export function useClearCart(userId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api<CartDTO>(`/cart/clear-cart/${userId}`, {
            method: "DELETE"
        }, localStorage.getItem("token") ?? undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        }
    })
}
