import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderDTO } from "@/types/order";
import { useAuth } from "@/contexts/AuthContext";

export function useCancelOrder() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (orderId: number) => api<OrderDTO>(`/order/order/${orderId}/cancel`, {
            method: "PATCH"
        }, token ?? undefined),
        onSuccess: (_data, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        }
    })
}
