import { describe, test, expect, beforeEach } from "vitest"
import useTodos from "./useTodos"
import type { Todo } from "../components/types"
import { useState } from "react"


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



