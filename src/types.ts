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

export type View = "list" | "detail"