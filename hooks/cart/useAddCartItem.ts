import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCartItemDTO, CartDTO } from "@/types/cart";

export function useAddCartItem(userId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item: AddCartItemDTO) => api<CartDTO>(`/cart/add-item/${userId}`, {
            method: "POST",
            body: JSON.stringify(item)
        }, localStorage.getItem("token") ?? undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        }
    })
}
