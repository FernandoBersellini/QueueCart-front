import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderDTO } from "@/types/order";

export function useShipOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: number) => api<OrderDTO>(`/order/order/${orderId}/ship`, {
            method: "PATCH"
        }, localStorage.getItem("token") ?? undefined),
        onSuccess: (_data, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        }
    })
}
