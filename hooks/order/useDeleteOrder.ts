import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: number) => api(`/order/delete-order/${orderId}`, {
            method: "DELETE"
        }, localStorage.getItem("token") ?? undefined),
        onSuccess: (_data, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.removeQueries({ queryKey: ["order", orderId] });
        }
    })
}
