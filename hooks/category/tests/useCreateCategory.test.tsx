import { server } from "@/tests/mocks/server"
import { createWrapper } from "@/tests/createWrapper"
import { http, HttpResponse } from "msw"
import { describe, it, expect, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useCreateCategory } from "../useCreateCategory"

describe("useCreateCategory", () => {
    it("creates a category and invalidates the categories list", async () => {
        server.use(
            http.post("http://localhost:8080/category/create-category", () =>
                HttpResponse.json({
                    "id": 1,
                    "name": "Category Name",
                    "description": "Category Description",
                    "active": true,
                    "parentId": null
                }, { status: 201 }),
            )
        )

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useCreateCategory(), { wrapper: Wrapper })

        result.current.mutate({
            name: "Category Name",
            slug: "category-name",
            description: "Category Description",
            parentId: null,
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toMatchObject({ id: 1, name: "Category Name" })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] })
    })

    it("surfaces an ApiError when creation fails", async () => {
        server.use(
            http.post("http://localhost:8080/category/create-category", () =>
                HttpResponse.json(
                    { message: "name already exists", errorCode: "CONFLICT", timestamp: new Date().toISOString() },
                    { status: 409 },
                ),
            )
        )

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useCreateCategory(), { wrapper: Wrapper })

        result.current.mutate({
            name: "Category Name",
            slug: "category-name",
            description: "Category Description",
            parentId: null,
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe("name already exists")
    })
})
