import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { OrderDTO } from "@/types/order";
import { PageResponseDTO } from "@/types/pagination";
import { useAuth } from "@/contexts/AuthContext";

export function useOrdersByUser(userId: number, page = 0, size = 20) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["orders", "user", userId, { page, size }],
        queryFn: () => api<PageResponseDTO<OrderDTO>>(`/order/order/user/${userId}?page=${page}&size=${size}`, {}, token ?? undefined)
    })
}
