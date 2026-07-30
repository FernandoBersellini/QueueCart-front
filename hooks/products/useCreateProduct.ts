import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProductDTO } from "@/types/product";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export function useCreateProduct() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (newProduct: CreateProductDTO) => api(
            "/product/create-product",
            {
                method: "POST",
                body: JSON.stringify(newProduct),
            },
            token ?? undefined
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    })
}