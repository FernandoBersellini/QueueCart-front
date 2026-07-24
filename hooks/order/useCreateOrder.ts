import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateOrderDTO, OrderDTO } from "@/types/order";

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newOrder: CreateOrderDTO) => api<OrderDTO>("/order/create-order", {
            method: "POST",
            body: JSON.stringify(newOrder)
        }, localStorage.getItem("token") ?? undefined),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", "user", variables.userId] });
        }
    })
}
