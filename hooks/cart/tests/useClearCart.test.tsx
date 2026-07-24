import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useClearCart } from "../useClearCart"

describe("useClearCart", () => {
    it("clears the cart and invalidates it", async () => {
        server.use(
            http.delete("http://localhost:8080/cart/clear-cart/:userId", () =>
                HttpResponse.json({ id: 1, userId: 1, items: [] })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useClearCart(1), { wrapper: Wrapper })

        result.current.mutate()

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.items).toHaveLength(0)
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart", 1] })
    })

    it("surfaces an ApiError when clearing fails", async () => {
        server.use(
            http.delete("http://localhost:8080/cart/clear-cart/:userId", () =>
                HttpResponse.json(
                    { message: "Cart not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useClearCart(1), { wrapper: Wrapper })

        result.current.mutate()

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Cart not found")
    })
})
