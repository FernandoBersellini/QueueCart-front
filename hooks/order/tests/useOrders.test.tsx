import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { useOrders } from "../useOrders"

const order = {
    id: 1,
    userId: 1,
    status: "PENDING",
    items: [{ productId: 5, productName: "Widget", unitPrice: 9.99, quantity: 2, subtotal: 19.98 }],
    totalAmount: 19.98,
    createdAt: "2026-07-24T12:00:00Z",
    updatedAt: "2026-07-24T12:00:00Z",
}

describe("useOrders", () => {
    it("returns a page of orders from the API", async () => {
        server.use(
            http.get("http://localhost:8080/order/all-orders", () =>
                HttpResponse.json({ content: [order], page: 0, size: 20, totalElements: 1, totalPages: 1, last: true })
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useOrders(), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.content).toHaveLength(1)
        expect(result.current.data?.content[0].status).toBe("PENDING")
    })

    it("surfaces an ApiError when the request fails", async () => {
        server.use(
            http.get("http://localhost:8080/order/all-orders", () =>
                HttpResponse.json(
                    { message: "boom", errorCode: "INTERNAL_SERVER_ERROR", timestamp: new Date().toISOString() },
                    { status: 500 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useOrders(), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("boom")
    })
})
