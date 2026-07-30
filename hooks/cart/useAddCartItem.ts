import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCartItemDTO, CartDTO } from "@/types/cart";
import { useAuth } from "@/contexts/AuthContext";

export function useAddCartItem(userId: number) {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (item: AddCartItemDTO) => api<CartDTO>(`/cart/add-item/${userId}`, {
            method: "POST",
            body: JSON.stringify(item)
        }, token ?? undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        }
    })
}
