import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useCreateOrder } from "../useCreateOrder"

describe("useCreateOrder", () => {
    it("creates an order and invalidates orders + user orders", async () => {
        server.use(
            http.post("http://localhost:8080/order/create-order", () =>
                HttpResponse.json({
                    id: 1,
                    userId: 7,
                    status: "PENDING",
                    items: [{ productId: 5, productName: "Widget", unitPrice: 9.99, quantity: 2, subtotal: 19.98 }],
                    totalAmount: 19.98,
                    createdAt: "2026-07-24T12:00:00Z",
                    updatedAt: "2026-07-24T12:00:00Z",
                }, { status: 201 })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useCreateOrder(), { wrapper: Wrapper })

        result.current.mutate({
            userId: 7,
            items: [{ productId: 5, productName: "Widget", unitPrice: 9.99, quantity: 2 }],
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toMatchObject({ id: 1, userId: 7 })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["orders"] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["orders", "user", 7] })
    })

    it("surfaces an ApiError when creation fails", async () => {
        server.use(
            http.post("http://localhost:8080/order/create-order", () =>
                HttpResponse.json(
                    { message: "invalid order", errorCode: "BAD_REQUEST", timestamp: new Date().toISOString() },
                    { status: 400 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useCreateOrder(), { wrapper: Wrapper })

        result.current.mutate({
            userId: 7,
            items: [{ productId: 5, productName: "Widget", unitPrice: 9.99, quantity: 2 }],
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("invalid order")
    })
})
