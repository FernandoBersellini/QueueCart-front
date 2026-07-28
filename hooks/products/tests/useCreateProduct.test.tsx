import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useCreateProduct } from "../useCreateProduct"

describe("useCreateProduct", () => {
    it("creates a product and invalidates the products list", async () => {
        server.use(
            http.post("http://localhost:8080/product/create-product", () =>
                HttpResponse.json({ id: 1, name: "Widget", description: "", sku: "W-1", price: 9.99, active: true, categoryId: 1, imageUrls: [] }, { status: 201 })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useCreateProduct(), { wrapper: Wrapper })

        result.current.mutate({ name: "Widget", description: "", sku: "W-1", price: 9.99, categoryId: 1 })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toMatchObject({ id: 1, name: "Widget" })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["products"] })
    })

    it("surfaces an ApiError when creation fails", async () => {
        server.use(
            http.post("http://localhost:8080/product/create-product", () =>
                HttpResponse.json(
                    { message: "sku already exists", errorCode: "CONFLICT", timestamp: new Date().toISOString() },
                    { status: 409 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useCreateProduct(), { wrapper: Wrapper })

        result.current.mutate({ name: "Widget", description: "", sku: "W-1", price: 9.99, categoryId: 1 })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("sku already exists")
    })
})
