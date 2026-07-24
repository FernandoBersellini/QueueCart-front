import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AuthResponseDTO, SignInDTO } from "@/types/auth";

export function useSignIn() {
    return useMutation({
        mutationFn: (credentials: SignInDTO) => api<AuthResponseDTO>("/user/auth/sign-in", {
            method: "POST",
            body: JSON.stringify(credentials)
        })
    })
}
