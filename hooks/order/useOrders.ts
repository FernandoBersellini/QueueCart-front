import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { OrderDTO } from "@/types/order";
import { PageResponseDTO } from "@/types/pagination";

export function useOrders(page = 0, size = 20) {
    return useQuery({
        queryKey: ["orders", { page, size }],
        queryFn: () => api<PageResponseDTO<OrderDTO>>(`/order/all-orders?page=${page}&size=${size}`, {}, localStorage.getItem("token") ?? undefined)
    })
}
