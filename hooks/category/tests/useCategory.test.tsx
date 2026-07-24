import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mocks/server";
import { createWrapper } from "@/tests/createWrapper";
import { useCategory } from "../useCategory";

describe("useCategory", () => {
  it("returns categories from the API", async () => {
    server.use(
      http.get("http://localhost:8080/category/all-categories", () =>
        HttpResponse.json([
          { id: 1, name: "Books", slug: "books", description: "", active: true, parentId: null },
        ])
      )
    );

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCategory(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].name).toBe("Books");
  });

  it("surfaces an ApiError when the request fails", async () => {
    server.use(
      http.get("http://localhost:8080/category/all-categories", () =>
        HttpResponse.json(
          { message: "boom", errorCode: "INTERNAL_SERVER_ERROR", timestamp: new Date().toISOString() },
          { status: 500 }
        )
      )
    );

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCategory(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("boom");
  });
});
