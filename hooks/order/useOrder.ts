import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { OrderDTO } from "@/types/order";
import { useAuth } from "@/contexts/AuthContext";

export function useOrder(orderId: number) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => api<OrderDTO>(`/order/order/${orderId}`, {}, token ?? undefined)
    })
}
