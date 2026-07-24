import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useRemoveCartItem } from "../useRemoveCartItem"

describe("useRemoveCartItem", () => {
    it("removes an item and invalidates the cart", async () => {
        server.use(
            http.delete("http://localhost:8080/cart/remove-item/:userId/:productId", () =>
                HttpResponse.json({ id: 1, userId: 1, items: [] })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useRemoveCartItem(1), { wrapper: Wrapper })

        result.current.mutate(5)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.items).toHaveLength(0)
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart", 1] })
    })

    it("surfaces an ApiError when removal fails", async () => {
        server.use(
            http.delete("http://localhost:8080/cart/remove-item/:userId/:productId", () =>
                HttpResponse.json(
                    { message: "Product not found in cart", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useRemoveCartItem(1), { wrapper: Wrapper })

        result.current.mutate(5)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Product not found in cart")
    })
})
