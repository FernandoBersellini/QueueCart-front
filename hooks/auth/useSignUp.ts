import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AuthResponseDTO, SignUpDTO } from "@/types/auth";

export function useSignUp() {
    return useMutation({
        mutationFn: (newUser: SignUpDTO) => api<AuthResponseDTO>("/user/auth/sign-up", {
            method: "POST",
            body: JSON.stringify(newUser)
        })
    })
}
