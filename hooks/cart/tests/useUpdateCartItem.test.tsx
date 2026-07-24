import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useUpdateCartItem } from "../useUpdateCartItem"

describe("useUpdateCartItem", () => {
    it("updates an item's quantity and invalidates the cart", async () => {
        server.use(
            http.patch("http://localhost:8080/cart/update-item/:userId/:productId", () =>
                HttpResponse.json({ id: 1, userId: 1, items: [{ productId: 5, quantity: 4 }] })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useUpdateCartItem(1), { wrapper: Wrapper })

        result.current.mutate({ productId: 5, quantity: 4 })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.items[0].quantity).toBe(4)
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart", 1] })
    })

    it("surfaces an ApiError when the update fails", async () => {
        server.use(
            http.patch("http://localhost:8080/cart/update-item/:userId/:productId", () =>
                HttpResponse.json(
                    { message: "Product not found in cart", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useUpdateCartItem(1), { wrapper: Wrapper })

        result.current.mutate({ productId: 5, quantity: 4 })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Product not found in cart")
    })
})
