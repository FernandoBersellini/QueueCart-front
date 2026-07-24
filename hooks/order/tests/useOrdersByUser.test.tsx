import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { useOrdersByUser } from "../useOrdersByUser"

describe("useOrdersByUser", () => {
    it("returns a page of orders for a user", async () => {
        server.use(
            http.get("http://localhost:8080/order/order/user/:userId", () =>
                HttpResponse.json({
                    content: [{
                        id: 1,
                        userId: 7,
                        status: "PENDING",
                        items: [],
                        totalAmount: 0,
                        createdAt: "2026-07-24T12:00:00Z",
                        updatedAt: "2026-07-24T12:00:00Z",
                    }],
                    page: 0,
                    size: 20,
                    totalElements: 1,
                    totalPages: 1,
                    last: true,
                })
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useOrdersByUser(7), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.content).toHaveLength(1)
        expect(result.current.data?.content[0].userId).toBe(7)
    })

    it("surfaces an ApiError when the request fails", async () => {
        server.use(
            http.get("http://localhost:8080/order/order/user/:userId", () =>
                HttpResponse.json(
                    { message: "boom", errorCode: "INTERNAL_SERVER_ERROR", timestamp: new Date().toISOString() },
                    { status: 500 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useOrdersByUser(7), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("boom")
    })
})
