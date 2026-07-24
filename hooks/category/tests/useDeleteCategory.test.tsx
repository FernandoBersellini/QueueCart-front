import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it, vi } from "vitest"
import { useDeleteCategory } from "../useDeleteCategory"

describe("useDeleteCategory", () => {
    it("deletes a category", async () => {
        server.use(
            http.delete("http://localhost:8080/category/delete-category/:id", () =>
                HttpResponse.json({}, { status: 204 }),
            ),
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useDeleteCategory(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] })
    })

    it("surfaces an ApiError when deletion fails", async () => {
        server.use(
            http.delete("http://localhost:8080/category/delete-category/:id", () =>
                HttpResponse.json({ message: "Category not found", errorCode: "NOT_FOUND", timestamp: new Date().toISOString() }, { status: 404 }),
            ),
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useDeleteCategory(), { wrapper: Wrapper })

        result.current.mutate(1)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("Category not found")
    })
})