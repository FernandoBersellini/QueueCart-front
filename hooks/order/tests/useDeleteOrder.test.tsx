import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useDeleteOrder } from "../useDeleteOrder"

describe("useDeleteOrder", () => {
    it("deletes an order and invalidates the list", async () => {
        server.use(
            http.delete("http://localhost:8080/order/delete-order/:id", () =>
                HttpResponse.json({}, { status: 204 })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")
        const removeSpy = vi.spyOn(queryClient, "removeQueries")

        const { result } = renderHook(() => useDeleteOrder(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["orders"] })
        expect(removeSpy).toHaveBeenCalledWith({ queryKey: ["order", 1] })
    })

    it("surfaces an ApiError when deletion fails", async () => {
        server.use(
            http.delete("http://localhost:8080/order/delete-order/:id", () =>
                HttpResponse.json(
                    { message: "Order not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useDeleteOrder(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Order not found")
    })
})
