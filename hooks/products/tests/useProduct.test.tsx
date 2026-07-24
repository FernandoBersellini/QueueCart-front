import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { useProduct } from "../useProduct"

describe("useProduct", () => {
    it("returns a single product from the API", async () => {
        server.use(
            http.get("http://localhost:8080/product/product/:id", () =>
                HttpResponse.json({ id: 1, name: "Widget", description: "", sku: "W-1", price: 9.99, active: true, categoryId: 1 })
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useProduct(1), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toMatchObject({ id: 1, name: "Widget" })
    })

    it("surfaces an ApiError when the product is not found", async () => {
        server.use(
            http.get("http://localhost:8080/product/product/:id", () =>
                HttpResponse.json(
                    { message: "Product not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() },
                    { status: 404 }
                )
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useProduct(1), { wrapper: Wrapper })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Product not found")
    })
})
