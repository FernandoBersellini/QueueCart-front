import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { useOrder } from "../useOrder"

describe("useOrder", () => {
    it("returns a single order from the API", async () => {
        server.use(
            http.get("http://localhost:8080/order/order/:id", () =>
                HttpResponse.json({
                    id: 1,
                    userId: 1,
                    status: "PENDING",
                    items: [],
                    totalAmount: 0,
                    createdAt: "2026-07-24T12:00:00Z",
                    updatedAt: "2026-07-24T12:00:00Z",
                })
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useOrder(1), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toMatchObject({ id: 1, status: "PENDING" })
    })

    it("surfaces an ApiError when the order is not found", async () => {
        server.use(
            http.get("http://localhost:8080/order/order/:id", () =>
                HttpResponse.json(
                    { message: "Order not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useOrder(1), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Order not found")
    })
})
