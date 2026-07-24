import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { OrderDTO } from "@/types/order";

export function useOrder(orderId: number) {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => api<OrderDTO>(`/order/order/${orderId}`, {}, localStorage.getItem("token") ?? undefined)
    })
}
