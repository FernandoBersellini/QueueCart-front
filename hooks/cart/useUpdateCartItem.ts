import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCartItemDTO, CartDTO } from "@/types/cart";

export function useUpdateCartItem(userId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, quantity }: { productId: number } & UpdateCartItemDTO) =>
            api<CartDTO>(`/cart/update-item/${userId}/${productId}`, {
                method: "PATCH",
                body: JSON.stringify({ quantity })
            }, localStorage.getItem("token") ?? undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        }
    })
}
