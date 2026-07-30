import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProductDTO } from "@/types/product";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (updatedProduct: UpdateProductDTO) => api(
            `/product/update-product/${updatedProduct.id}`,
            {
                method: "PATCH",
                body: JSON.stringify(updatedProduct),
            },
            token ?? undefined
        ),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
        }
    })
}