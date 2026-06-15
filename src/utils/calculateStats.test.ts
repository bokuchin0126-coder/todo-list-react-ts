import { describe, test, expect } from "vitest"
import calculateStats from "./calculateStats"
import type { Todo } from "../components/types"

const createTodo = (
    overrides: Partial<Todo> = {}
): Todo => ({
    id: 1,
    text: "Test Todo",
    status: "active",
    todoDate: "2026-06-15",
    isEditing: false,
    categoryId: 1,
    createdAt: "",
    ...overrides
})

describe("todayAchievement", () => {
    test("returns 100 when all todos are completed", () => {
        const todos: Todo[] = [
            createTodo({
                status: "completed"
            }),
            createTodo({
                id: 2,
                status: "completed"
            })
        ]

        const stats = calculateStats(
            todos,
            "2026-06-15",
            "2026-06-15"
        )

        expect(stats.todayAchievement()).toBe(100)
    })

    test("returns 50 when one of two todos is completed", () => {
       const todos: Todo[] = [
            createTodo({
                status: "completed"
            }),
            createTodo({
                id: 2,
                status: "active"
            })
        ]
        const stats = calculateStats(
            todos,
            "2026-06-15",
            "2026-06-15"
        )

        expect(stats.todayAchievement()).toBe(50)
    })

    test("returns 0 when no todos are completed", () => {
       const todos: Todo[] = [
            createTodo({
                status: "active"
            }),
            createTodo({
                id: 2,
                status: "active"
            })
        ]
        const stats = calculateStats(
            todos,
            "2026-06-15",
            "2026-06-15"
        )

        expect(stats.todayAchievement()).toBe(0)
    })

    test("returns 0 when there are no todos", () => {
        const todos: Todo[] = []

        const stats = calculateStats(
            todos,
            "2026-06-15",
            "2026-06-15"
        )
        expect(stats.todayAchievement()).toBe(0)
    })
})

describe("wholeAchievement", () => {
    test("returns 100 when all todos are completed", () => {
        const todos: Todo[] = [
            createTodo({
                status: "completed"
            }),
            createTodo({
                id: 2,
                status: "completed"
            })
        ]
        const stats = calculateStats(
            todos,
            "2026-06-15",
            "2026-06-15"
        )
        expect(stats.wholeAchievement()).toBe(100)
    })

    test("returns 50 when one of two todos id completed", () => {
        const todos: Todo[] = [
            createTodo({
                status: "completed"
            }),
            createTodo({
                id: 2,
                status: "active"
            })
        ]
        const stats = calculateStats(
            todos,
            "2026-06-15",
            "2026-06-15"
        )
        expect(stats.wholeAchievement()).toBe(50)
    })

    test("returns 0 when all todos are active", () => {
        const todos: Todo[] = [
            createTodo({
                status: "active"
            }),
            createTodo({
                id: 2,
                status: "active"
            })
        ]
        const stats = calculateStats(
            todos,
            "2026-06-15",
            "2026-06-15"
        )
        expect(stats.wholeAchievement()).toBe(0)
    })

    test("returns 0 when there are no todos", () => {
        const todos: Todo[] = []
        const stats = calculateStats(
            todos,
            "2026-06-15",
            "2026-06-15"
        )
        expect(stats.wholeAchievement()).toBe(0)
    })
})

describe("continuousAchievement", () => {
    
})
