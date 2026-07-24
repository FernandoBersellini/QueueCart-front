import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { useCart } from "../useCart"

describe("useCart", () => {
    it("returns the cart for a user", async () => {
        server.use(
            http.get("http://localhost:8080/cart/:userId", () =>
                HttpResponse.json({ id: 1, userId: 1, items: [{ productId: 5, quantity: 2 }] })
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useCart(1), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.items).toHaveLength(1)
        expect(result.current.data?.items[0].productId).toBe(5)
    })

    it("surfaces an ApiError when the request fails", async () => {
        server.use(
            http.get("http://localhost:8080/cart/:userId", () =>
                HttpResponse.json(
                    { message: "boom", errorCode: "INTERNAL_SERVER_ERROR", timestamp: new Date().toISOString() },
                    { status: 500 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useCart(1), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("boom")
    })
})
