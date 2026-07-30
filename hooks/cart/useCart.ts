import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { CartDTO } from "@/types/cart";
import { useAuth } from "@/contexts/AuthContext";

export function useCart(userId: number) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["cart", userId],
        queryFn: () => api<CartDTO>(`/cart/${userId}`, {}, token ?? undefined)
    })
}
