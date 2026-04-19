export type Status = "active" | "completed"

export type Todo = {
    id: number
    text: string
    status: Status
    isEditing: boolean
    categoryId: number | null
}

export type Category = {
    id: number
    name: string
}

export type Filter = "all" | Status

export type View = "list" | "detail"