import { describe, test, expect, beforeEach, vi } from "vitest"
import { createCategory, keepTextCategory, keepColorCategory, deleteCategory } from "./categoryApi"


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

    const deleteMock = vi.fn(() => ({
        eq: eqMock
    }))

    const fromMock = vi.fn()

    return {
        selectMock,
        insertMock,
        eqMock,
        updateMock,
        deleteMock,
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
        await createCategory("筋トレ", "green")

        expect(mocks.fromMock).toHaveBeenCalledWith("categories")
        expect(mocks.insertMock).toHaveBeenCalledWith({
            name: "筋トレ",
            color: "green"
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
        await keepTextCategory(5, "勉強")
        
        expect(mocks.fromMock).toHaveBeenCalledWith("categories")
        expect(mocks.updateMock).toHaveBeenCalledWith({
            name: "勉強"
        })
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})

describe("keepColorCategory", () => {
    beforeEach(() => {
        mocks.fromMock.mockReturnValue({
            update: mocks.updateMock
        })
    })

    test("update category coloc by id", async () => {
        await keepColorCategory(5, "red")
        
        expect(mocks.fromMock).toHaveBeenCalledWith("categories")
        expect(mocks.updateMock).toHaveBeenCalledWith({
            color: "red"
        })
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})

describe("deleteCategory", () => {
    beforeEach(() => {
        mocks.fromMock.mockReturnValue({
            delete: mocks.deleteMock
        })
    })

    test("delete category by id", async () => {
        await deleteCategory(5)

        expect(mocks.fromMock).toHaveBeenCalledWith("categories")
        expect(mocks.deleteMock).toHaveBeenCalled()
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})