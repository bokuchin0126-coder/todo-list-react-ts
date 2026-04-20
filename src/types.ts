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

export type Filter = "all" | "active" | "completed"

export type View = "list" | "detail"