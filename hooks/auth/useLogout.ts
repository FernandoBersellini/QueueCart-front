import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
    return useMutation({
        mutationFn: (token: string) => api("/user/auth/logout", {
            method: "POST"
        }, token)
    })
}
