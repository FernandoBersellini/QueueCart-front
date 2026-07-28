import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { useProductsByCategory } from "../useProductsByCategory"

describe("useProductsByCategory", () => {
    it("returns a page of products for a category", async () => {
        server.use(
            http.get("http://localhost:8080/product/product/category/:categoryId", () =>
                HttpResponse.json({
                    content: [{ id: 1, name: "Widget", description: "", sku: "W-1", price: 9.99, active: true, categoryId: 3, imageUrls: [] }],
                    page: 0,
                    size: 20,
                    totalElements: 1,
                    totalPages: 1,
                    last: true,
                })
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useProductsByCategory(3), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.content).toHaveLength(1)
        expect(result.current.data?.content[0].categoryId).toBe(3)
    })

    it("surfaces an ApiError when the request fails", async () => {
        server.use(
            http.get("http://localhost:8080/product/product/category/:categoryId", () =>
                HttpResponse.json(
                    { message: "boom", errorCode: "INTERNAL_SERVER_ERROR", timestamp: new Date().toISOString() },
                    { status: 500 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useProductsByCategory(3), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("boom")
    })
})
