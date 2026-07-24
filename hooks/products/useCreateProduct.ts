import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProductDTO } from "@/types/product";
import { api } from "@/utils/api";

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newProduct: CreateProductDTO) => api(
            "/product/create-product", 
            {
                method: "POST",
                body: JSON.stringify(newProduct),
                headers: {
                    "Content-Type": "application/json",
                }
            }, 
            localStorage.getItem("token") ?? undefined
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    })
}