import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCartItemDTO, CartDTO } from "@/types/cart";
import { useAuth } from "@/contexts/AuthContext";

export function useUpdateCartItem(userId: number) {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: ({ productId, quantity }: { productId: number } & UpdateCartItemDTO) =>
            api<CartDTO>(`/cart/update-item/${userId}/${productId}`, {
                method: "PATCH",
                body: JSON.stringify({ quantity })
            }, token ?? undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        }
    })
}
