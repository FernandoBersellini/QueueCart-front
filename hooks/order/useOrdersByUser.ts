import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { OrderDTO } from "@/types/order";
import { PageResponseDTO } from "@/types/pagination";

export function useOrdersByUser(userId: number, page = 0, size = 20) {
    return useQuery({
        queryKey: ["orders", "user", userId, { page, size }],
        queryFn: () => api<PageResponseDTO<OrderDTO>>(`/order/order/user/${userId}?page=${page}&size=${size}`, {}, localStorage.getItem("token") ?? undefined)
    })
}
