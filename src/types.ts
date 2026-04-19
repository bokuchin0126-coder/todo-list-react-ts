export type Status = "active" | "completed"

export type Todo = {
    id: number
    text: string
    status: Status
    isEditing: boolean
}

export type Filter = "all" | Status

export type View = "list" | "detail"