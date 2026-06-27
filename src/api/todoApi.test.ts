import { describe, test, expect, beforeEach, vi } from "vitest"
import type { Todo } from "../components/types"
import {
    createTodo,
    deleteTodo,
    updateTodoStatus,
    updateTodoText,
    updateTodoMemo,
    updateCatoryId,
    fetchTodos
} from "./todoApi"


const mocks = vi.hoisted(() => {
    const selectMock = vi.fn().mockResolvedValue({
        data: [{}],
        error: null
    })
    const insertMock = vi.fn(() => ({
        select: selectMock
    }))

    const deleteEqMock = vi.fn().mockResolvedValue({
        error: null
    })
    const eqMock = vi.fn(() => ({
        select: selectMock
    }))
    const deleteMock = vi.fn(() => ({
        eq: deleteEqMock
    }))
    const updateMock = vi.fn(() => ({
        eq: eqMock
    }))

    const fromMock = vi.fn()

    return {
        selectMock,
        insertMock,
        deleteEqMock,
        eqMock,
        deleteMock,
        updateMock,
        fromMock
    }
})

vi.mock("../lib/supabase", () => ({
    supabase: {
        from: mocks.fromMock
    }
}))

describe("createTodo", () => {
    beforeEach(() => {
        mocks.fromMock.mockReturnValue({
            insert: mocks.insertMock
        })
    })

    test("creates todo and returns created todo", async () => {
        await createTodo("勉強", "UI整理とメモ機能の追加", 5, "2026-06-01")

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.insertMock).toHaveBeenCalledWith({
            text: "勉強",
            status: "active",
            memo: "UI整理とメモ機能の追加",
            category_id: 5,
            todo_date: "2026-06-01"
        })
        expect(mocks.selectMock).toHaveBeenCalled()
    })
})

describe("deleteTodo", () =>  {
    beforeEach(() => {
        mocks.fromMock.mockReturnValue({
            delete: mocks.deleteMock
        })
    })

    test("deletes todo by id", async () => {
        await deleteTodo(5)

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.deleteMock).toHaveBeenCalled()
        expect(mocks.deleteEqMock).toHaveBeenCalledWith("id", 5)
    })
})

describe("updateTodoStatus", () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mocks.fromMock.mockReturnValue({
            update: mocks.updateMock
        })
    })

    test("updates todo status to completed", async () => {
        await updateTodoStatus(5, "completed")

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.updateMock).toHaveBeenCalledWith(
            expect.objectContaining({
            status: "completed"
            })
        )
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})

describe("updateTodoText", () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mocks.fromMock.mockReturnValue({
            update: mocks.updateMock
        })
    })

    test("updates todo text by id", async () => {
        await updateTodoText(5, "コード整理")

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.updateMock).toHaveBeenCalledWith(
            expect.objectContaining({
            text: "コード整理"
            })
        )
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})

describe("updateTodoMemo", () => {

    beforeEach(() => {
        vi.clearAllMocks()

        mocks.fromMock.mockReturnValue({
            update: mocks.updateMock
        })
    })

    test("updates todo memo by id", async () => {
        await updateTodoMemo(5, "メモ内容を修正")

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.updateMock).toHaveBeenCalledWith(
            expect.objectContaining({
            memo: "メモ内容を修正"
            })
        )
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})

describe("updateCatoryId", () => {

    beforeEach(() => {
        vi.clearAllMocks()

        mocks.fromMock.mockReturnValue({
            update: mocks.updateMock
        })
    })

    test("updates todo memo by id", async () => {
        await updateCatoryId(5, 4)

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.updateMock).toHaveBeenCalledWith(
            expect.objectContaining({
              category_id: 4
            })
        )
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})

describe("fetchTodos", () => {
    beforeEach(() => {
        mocks.fromMock.mockReturnValue({
            select: mocks.selectMock
        })
    })

    test("fetches all todos", async () => {
        await fetchTodos()

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.selectMock).toHaveBeenCalledWith("*")
    })
})