export type Todo = {
    id: number
    text: string
    status: "active" | "completed"
    memo: string
    isEditing: boolean
    categoryId: number
    createdAt: string
    updatedAt: string
    todoDate: string
}

export type Category = {
    id: number
    name: string
    isEditing: boolean
}

export type Filter = "all" | "active" | "completed"