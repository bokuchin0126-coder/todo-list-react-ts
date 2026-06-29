import { describe, test, expect, beforeEach } from "vitest"
import {
    getTodosByDate, 
    getCompletedTodos, 
    getTodosByCategory, 
    getTodosInRange
} from "./filterUtils"

import type { Todo } from "../components/types"

const today = "2026-06-16"
const day = (number: number) => {
    const date = new Date(today)
    date.setDate(date.getDate() + number)
    return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date)
}

const createTodo = (
    overrides: Partial<Todo> = {}
): Todo => ({
    id: 1,
    text: "Test Todo",
    status: "active",
    memo: "",
    todoDate: today,
    isEditing: false,
    categoryId: 1,
    createdAt: "",
    updatedAt: "",
    ...overrides
})

describe("getTodosByDate", () => {
    let todos: Todo[] = []
    beforeEach(() => {
        todos = [
            createTodo(),
            createTodo({ id: 2 }),
            createTodo({ id: 3 }),
            createTodo({ id: 4 })
        ]
    })

    test("returns one todo when one todo matches the selected date", () => {
        todos[0].todoDate = "2026-06-01"
        const result = getTodosByDate(todos, "2026-06-01")
        expect(result).toHaveLength(1)
    })

    test("returns two todos when two todos match the selected date", () => {
        todos[0].todoDate = "2026-06-01"
        todos[1].todoDate = "2026-06-01"
        const result = getTodosByDate(todos, "2026-06-01")
        expect(result).toHaveLength(2)
    })

    test("returns all todos when all todos match the selected date", () => {
        const result = getTodosByDate(todos, today)
        expect(result).toHaveLength(4)
    })

    test("returns empty array when no todos match the selected date", () => {
        const result = getTodosByDate(todos, "2026-05-01")
        expect(result).toHaveLength(0)
    })

    test("returns empty array when todos array is empty", () => {
        todos = []
        const result = getTodosByDate(todos, today)
        expect(result).toHaveLength(0)
    })
})

describe("getCompletedTodos", () => {
    let todos: Todo[]
    beforeEach(() => {
        todos = [
            createTodo(),
            createTodo({ id: 2 }),
            createTodo({ id: 3 }),
            createTodo({ id: 4 })
        ]
    })

    test("returns all completed todos", () => {
        todos[0].status = "completed"
        todos[1].status = "completed"
        todos[2].status = "completed"
        todos[3].status = "completed"

        const result = getCompletedTodos(todos)
        expect(result).toHaveLength(4)
    })

    test("ignores active todos", () => {
        const result = getCompletedTodos(todos)
        expect(result).toHaveLength(0)
    })

    test("retunrs only completed todos when statuses are mixed", () => {
        todos[0].status = "completed"
        const result = getCompletedTodos(todos)

        expect(result).toHaveLength(1)
    })

    test("returns empty array when there are no todos", () => {
        todos = []
        const result = getCompletedTodos(todos)
        expect(result).toHaveLength
    })
})

describe("getTodosByCategory", () => {
    let todos: Todo[]
    beforeEach(() => {
        todos = [
            createTodo(),
            createTodo({ id: 2 }),
            createTodo({ id: 3 }),
            createTodo({ id: 4 })
        ]
    })

    test("returns all todos in the selected category", () => {
        const result = getTodosByCategory(todos, 1)
        expect(result).toHaveLength(4)
    })

    test("returns only todos in the selected category", () => {
        todos[0].categoryId = 2
        todos[1].categoryId = 2

        const result = getTodosByCategory(todos, 1)
        expect(result).toHaveLength(2)
    })

    test("ignores todos from other categroies", () => {
        const result = getTodosByCategory(todos, 2)
        expect(result).toHaveLength(0)
    })

    test("return empty array when there are no todos", () => {
        todos = []
        const result = getTodosByCategory(todos, 1)
        expect(result).toHaveLength(0)
    })
})

describe("getTodosInRange", () => {
    let todos: Todo[]
    beforeEach(() => {
        todos = [
            createTodo(),
            createTodo({ id: 2, todoDate: day(-1) }),
            createTodo({ id: 3, todoDate: day(-2) }),
            createTodo({ id: 4, todoDate: day(-3) }),
            createTodo({ id: 4, todoDate: day(-4) })
        ]
    })

    test("returns all todos within the range", () => {
        const result = getTodosInRange(todos, today, day(-5))
        expect(result).toHaveLength(5)
    })
    
    test("returns only todos within the specified range", () => {
        const result = getTodosInRange(todos, today, day(-3))
        expect(result).toHaveLength(3)
    })

    test("ignores todos outside the range", () => {
        const result = getTodosInRange(todos, day(1), today)
        expect(result).toHaveLength(0)
    })

    test("returns empty array when there are no todos", () => {
        todos = []

        const result = getTodosInRange(todos, today, today)
        expect(result).toHaveLength(0)
    })

    test("retunrs only today's todos", () => {
        const result = getTodosInRange(todos, today, day(-1))
        expect(result).toHaveLength(1)
    })
})