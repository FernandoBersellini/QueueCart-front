import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useUpdateCategory } from "../useUpdateCategory"

describe("useUpdateCategory", () => {
    it("updates a category", async () => {
        server.use(
            http.patch("http://localhost:8080/category/update-category/:id",
                () => HttpResponse.json({ id: 1, name: "Test Category", slug: "test-category", description: "Test Category", parentId: null }, { status: 200 })
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useUpdateCategory(), { wrapper: Wrapper })

        result.current.mutate({ id: 1, name: "Test Category", slug: "test-category", description: "Test Category", parentId: null })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toMatchObject({ id: 1, name: "Test Category", slug: "test-category", description: "Test Category", parentId: null })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] })
    })

    it("surfaces an api error when update fails", async () => {
        server.use(
            http.patch("http://localhost:8080/category/update-category/:id",
                () => HttpResponse.json({ message: "category not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() }, { status: 404 })
            )
        )
        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useUpdateCategory(), { wrapper: Wrapper })

        result.current.mutate({ id: 1, name: "Test Category", slug: "test-category", description: "Test Category", parentId: null })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("category not found")
    })
})
