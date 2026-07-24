import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { CartDTO } from "@/types/cart";

export function useCart(userId: number) {
    return useQuery({
        queryKey: ["cart", userId],
        queryFn: () => api<CartDTO>(`/cart/${userId}`, {}, localStorage.getItem("token") ?? undefined)
    })
}
