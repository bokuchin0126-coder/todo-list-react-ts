export type Todo = {
    id: number
    text: string
    status: "active" | "completed"
    isEditing: boolean
    categoryId: number | null
    createdAt: string
    todoDate: string
}

export type Category = {
    id: number
    name: string
    isEditing: boolean
}

export type Filter = "all" | "active" | "completed"