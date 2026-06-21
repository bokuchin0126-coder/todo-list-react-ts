import { describe, test, expect, beforeEach, vi } from "vitest"
import { createCategory, keepCategory } from "./categoryApi"


const mocks = vi.hoisted(() => {
    const selectMock = vi.fn().mockReturnValue({
        data: [{}],
        error: null
    })
    const insertMock = vi.fn(() => ({
        select: selectMock
    }))

    const eqMock = vi.fn().mockReturnValue({
        error: null
    })
    const updateMock = vi.fn(() => ({
        eq: eqMock
    }))

    const fromMock = vi.fn()

    return {
        selectMock,
        insertMock,
        eqMock,
        updateMock,
        fromMock
    }
})

vi.mock("../lib/supabase", () => ({
    supabase: {
        from: mocks.fromMock
    }
}))

describe("createCategory", () => {
    beforeEach(() => {
        mocks.fromMock.mockReturnValue({
            insert: mocks.insertMock
        })
    })

    test("creates category and returns created category", async () => {
        await createCategory("筋トレ")

        expect(mocks.fromMock).toHaveBeenCalledWith("categories")
        expect(mocks.insertMock).toHaveBeenCalledWith({
            name: "筋トレ"
        })
        expect(mocks.selectMock).toHaveBeenCalled()
    })
})

describe("keepCategory", () => {
    beforeEach(() => {
        mocks.fromMock.mockReturnValue({
            update: mocks.updateMock
        })
    })

    test("updates category name by id", async () => {
        await keepCategory(5, "勉強")
        
        expect(mocks.fromMock).toHaveBeenCalledWith("categories")
        expect(mocks.updateMock).toHaveBeenCalledWith({
            name: "勉強"
        })
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})