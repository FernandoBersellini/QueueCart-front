import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useAddCartItem } from "../useAddCartItem"

describe("useAddCartItem", () => {
    it("adds an item and invalidates the cart", async () => {
        server.use(
            http.post("http://localhost:8080/cart/add-item/:userId", () =>
                HttpResponse.json({ id: 1, userId: 1, items: [{ productId: 5, quantity: 2 }] })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useAddCartItem(1), { wrapper: Wrapper })

        result.current.mutate({ productId: 5, quantity: 2 })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.items).toHaveLength(1)
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["cart", 1] })
    })

    it("surfaces an ApiError when adding fails", async () => {
        server.use(
            http.post("http://localhost:8080/cart/add-item/:userId", () =>
                HttpResponse.json(
                    { message: "Product not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useAddCartItem(1), { wrapper: Wrapper })

        result.current.mutate({ productId: 5, quantity: 2 })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Product not found")
    })
})
