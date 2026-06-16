import { describe, test, expect } from "vitest"
import calculateStats from "./calculateStats"
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
    todoDate: today,
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
            today
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
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )

        expect(stats.todayAchievement()).toBe(50)
    })

    test("returns 0 when no todos are completed", () => {
       const todos: Todo[] = [
            createTodo(),
            createTodo({
                id: 2,
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )

        expect(stats.todayAchievement()).toBe(0)
    })

    test("returns 0 when there are no todos", () => {
        const todos: Todo[] = []

        const stats = calculateStats(
            todos,
            today
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
            today
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
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.wholeAchievement()).toBe(50)
    })

    test("returns 0 when all todos are active", () => {
        const todos: Todo[] = [
            createTodo(),
            createTodo({
                id: 2,
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.wholeAchievement()).toBe(0)
    })

    test("returns 0 when there are no todos", () => {
        const todos: Todo[] = []
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.wholeAchievement()).toBe(0)
    })
})

describe("designationAchievement", () => {
    test("returns 100 when all todos are completed", () => {
        const todos = [
            createTodo({
                status: "completed"
            }),
            createTodo({
                id: 2,
                status: "completed"
            }),
            createTodo({
                id: 3,
                status: "completed",
                todoDate: day(-1)
            }),
            createTodo({
                id: 4,
                status: "completed",
                todoDate: day(-1)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.designationAchievement(2)).toBe(100)
    })

    test("returns 75 when three of four todos are completed", () => {
        const todos = [
            createTodo(),
            createTodo({
                id: 2,
                status: "completed"
            }),
            createTodo({
                id: 3,
                status: "completed",
                todoDate: day(-1)
            }),
            createTodo({
                id: 4,
                status: "completed",
                todoDate: day(-1)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.designationAchievement(2)).toBe(75)
    })

    test("returns 50 when only one day is fully completed", () => {
         const todos = [
            createTodo({
                status: "completed"
            }),
            createTodo({
                id: 2,
                status: "completed"
            }),
            createTodo({
                id: 3,
                todoDate: day(-1)
            }),
            createTodo({
                id: 4,
                todoDate: day(-1)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.designationAchievement(2)).toBe(50)
    })

    test("returns 0 when no todos are completed", () => {
         const todos = [
            createTodo(),
            createTodo({
                id: 2
            }),
            createTodo({
                id: 3,
                todoDate: day(-1)
            }),
            createTodo({
                id: 4,
                todoDate: day(-1)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.designationAchievement(2)).toBe(0)
    })

    test("returns 0 when there are no todos", () => {
        const todos: Todo[] = []
        const stats = calculateStats(
            todos,
            today
        ) 
        expect(stats.designationAchievement(2)).toBe(0)
    })

    test("ignores todos from other dates", () => {
        const todos = [
            createTodo({
                status: "completed"
            }),
            createTodo({
                id: 2,
                status: "completed",
                todoDate: day(-1)
            }),
            createTodo({
                id: 3,
                todoDate: day(-2)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.designationAchievement(2)).toBe(100)
    })
})

describe("continuousAchievement", () => {
    test("returns 2 when today and yesterday are completed", () => {
        const todos = [
            createTodo({
                status: "completed",
            }),
            createTodo({
                id: 2,
                status: "completed",
                todoDate: day(-1)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.continuousAchievement()).toBe(2)
    })

    test("returns 1 when only today is completed", () => {
        const todos = [
            createTodo({
                status: "completed",
            }),
            createTodo({
                id: 2,
                todoDate: day(-1)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.continuousAchievement()).toBe(1)
    })

    test("returns 1 when today is not completed", () => {
        const todos = [
            createTodo(),
            createTodo({
                id: 2,
                status: "completed",
                todoDate: day(-1)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.continuousAchievement()).toBe(1)
    })

    test("returns 2 when the streak is broken two days ago", () => {
        const todos = [
            createTodo({
                status: "completed"
            }),
            createTodo({
                id: 2,
                status: "completed",
                todoDate: day(-1)
            }),
            createTodo({
                id: 3,
                todoDate: day(-2)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.continuousAchievement()).toBe(2)
    })

    test("returns 0 when today and yesterday are not completed", () => {
        const todos = [
            createTodo(),
            createTodo({
                id: 2,
                todoDate: day(-1)
            })
        ]
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.continuousAchievement()).toBe(0)
    })

    test("returns 0 when there are no todos", () => {
        const todos: Todo[] = []
        const stats = calculateStats(
            todos,
            today
        )
        expect(stats.continuousAchievement()).toBe(0)
    })
})
