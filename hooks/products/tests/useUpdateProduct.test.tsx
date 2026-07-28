import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useUpdateProduct } from "../useUpdateProduct"

describe("useUpdateProduct", () => {
    it("updates a product and invalidates list + item", async () => {
        server.use(
            http.patch("http://localhost:8080/product/update-product/:id", () =>
                HttpResponse.json({ id: 1, name: "Widget v2", description: "", sku: "W-1", price: 12.5, active: true, categoryId: 1, imageUrls: [] })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useUpdateProduct(), { wrapper: Wrapper })

        result.current.mutate({ id: 1, name: "Widget v2", description: "", sku: "W-1", price: 12.5, categoryId: 1 })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toMatchObject({ id: 1, name: "Widget v2" })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["products"] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["product", 1] })
    })

    it("surfaces an ApiError when update fails", async () => {
        server.use(
            http.patch("http://localhost:8080/product/update-product/:id", () =>
                HttpResponse.json(
                    { message: "Product not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useUpdateProduct(), { wrapper: Wrapper })

        result.current.mutate({ id: 1, name: "Widget v2", description: "", sku: "W-1", price: 12.5, categoryId: 1 })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Product not found")
    })
})
