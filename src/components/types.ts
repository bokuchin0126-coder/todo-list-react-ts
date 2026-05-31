export type  DailyTodo = {
    date: string
    todos: Todo[]
}

export type DailyCategory = {
    date: string
    categories: Category[]
}

export type Todo = {
    id: number
    text: string
    status: "active" | "completed"
    isEditing: boolean
    categoryId: number | null
}

export type Category = {
    id: number
    name: string
}

export type ApiTodo = {
    id: number
    title: string
    completed: boolean
}

export type Filter = "all" | "active" | "completed"