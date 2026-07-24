import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useConfirmOrder } from "../useConfirmOrder"

describe("useConfirmOrder", () => {
    it("confirms an order and invalidates list + item", async () => {
        server.use(
            http.patch("http://localhost:8080/order/order/:id/confirm", () =>
                HttpResponse.json({
                    id: 1, userId: 7, status: "CONFIRMED", items: [], totalAmount: 0,
                    createdAt: "2026-07-24T12:00:00Z", updatedAt: "2026-07-24T12:00:00Z",
                })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useConfirmOrder(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toMatchObject({ id: 1, status: "CONFIRMED" })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["orders"] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["order", 1] })
    })

    it("surfaces an ApiError when confirmation fails", async () => {
        server.use(
            http.patch("http://localhost:8080/order/order/:id/confirm", () =>
                HttpResponse.json(
                    { message: "invalid transition", errorCode: "BAD_REQUEST", timestamp: new Date().toISOString() },
                    { status: 400 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useConfirmOrder(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("invalid transition")
    })
})
