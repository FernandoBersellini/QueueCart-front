import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProductDTO } from "@/types/product";
import { api } from "@/utils/api";

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updatedProduct: UpdateProductDTO) => api(
            `/product/update-product/${updatedProduct.id}`,
            {
                method: "PATCH",
                body: JSON.stringify(updatedProduct),
                headers: {
                    "Content-Type": "application/json",
                }
            },
            localStorage.getItem("token") ?? undefined
        ),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
        }
    })
}