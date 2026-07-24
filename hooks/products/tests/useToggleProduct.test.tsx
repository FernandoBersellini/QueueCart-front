import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useToggleProduct } from "../useToggleProduct"

describe("useToggleProduct", () => {
    it("toggles a product and invalidates list + item", async () => {
        server.use(
            http.patch("http://localhost:8080/product/toggle-product/:id", () =>
                HttpResponse.json({ id: 1, name: "Widget", description: "", sku: "W-1", price: 9.99, active: false, categoryId: 1 })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useToggleProduct(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toMatchObject({ id: 1, active: false })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["products"] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["product", 1] })
    })

    it("surfaces an ApiError when toggle fails", async () => {
        server.use(
            http.patch("http://localhost:8080/product/toggle-product/:id", () =>
                HttpResponse.json(
                    { message: "Product not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useToggleProduct(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Product not found")
    })
})
