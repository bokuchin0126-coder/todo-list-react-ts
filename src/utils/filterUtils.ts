import type { Todo } from "../components/types"

export function getTodosByDate(todos: Todo[], date: string) {
    return todos.filter(todo => todo.todoDate === date)
}

export function getCompletedTodos(todos: Todo[]) {
    return todos.filter(todo => todo.status === "completed")
}

export function getTodosByCategory(todos: Todo[], categoryId: number) {
    return todos.filter(todo => todo.categoryId === categoryId)
}

export function getTodosInRange(todos: Todo[], today: string, formatted: string) {
    return todos.filter(todo => (
        todo.todoDate > formatted && todo.todoDate <= today
    ))
}