import { describe, test, expect, beforeEach, vi } from "vitest"
import type { Todo } from "../components/types"
import {
    createTodo,
    deleteTodo,
    updateTodoStatus,
    updateTodoText,
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

    const eqMock = vi.fn().mockResolvedValue({
        error: null
    })
    const deleteMock = vi.fn(() => ({
        eq: eqMock
    }))
    const updateMock = vi.fn(() => ({
        eq: eqMock
    }))

    const fromMock = vi.fn()

    return {
        selectMock,
        insertMock,
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
        await createTodo("勉強", 5, "2026-06-01")

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.insertMock).toHaveBeenCalledWith({
            text: "勉強",
            status: "active",
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
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})

describe("updateTodoStatus", () => {
    beforeEach(() => {
        mocks.fromMock.mockReturnValue({
            update: mocks.updateMock
        })
    })

    test("updates todo status to completed", async () => {
        await updateTodoStatus(5, "completed")

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.updateMock).toHaveBeenCalledWith({
            status: "completed"
        })
        expect(mocks.eqMock).toHaveBeenCalledWith("id", 5)
    })
})

describe("updateTodoText", () => {
    beforeEach(() => {
        mocks.fromMock.mockReturnValue({
            update: mocks.updateMock
        })
    })

    test("updates todo text by id", async () => {
        await updateTodoText(5, "コード整理")

        expect(mocks.fromMock).toHaveBeenCalledWith("todos")
        expect(mocks.updateMock).toHaveBeenCalledWith({
            text: "コード整理"
        })
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