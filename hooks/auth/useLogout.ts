import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

interface LogoutParams {
    token: string;
    refreshToken: string;
}

export function useLogout() {
    return useMutation({
        mutationFn: ({ token, refreshToken }: LogoutParams) => api("/user/auth/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken })
        }, token)
    })
}
