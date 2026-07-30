import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export function useDeleteOrder() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (orderId: number) => api(`/order/delete-order/${orderId}`, {
            method: "DELETE"
        }, token ?? undefined),
        onSuccess: (_data, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.removeQueries({ queryKey: ["order", orderId] });
        }
    })
}
