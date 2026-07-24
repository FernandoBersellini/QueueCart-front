import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useDeleteProduct } from "../useDeleteProduct"

describe("useDeleteProduct", () => {
    it("deletes a product and invalidates the list", async () => {
        server.use(
            http.delete("http://localhost:8080/product/delete-product/:id", () =>
                HttpResponse.json({}, { status: 204 })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")
        const removeSpy = vi.spyOn(queryClient, "removeQueries")

        const { result } = renderHook(() => useDeleteProduct(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["products"] })
        expect(removeSpy).toHaveBeenCalledWith({ queryKey: ["product", 1] })
    })

    it("surfaces an ApiError when deletion fails", async () => {
        server.use(
            http.delete("http://localhost:8080/product/delete-product/:id", () =>
                HttpResponse.json(
                    { message: "Product not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useDeleteProduct(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Product not found")
    })
})
