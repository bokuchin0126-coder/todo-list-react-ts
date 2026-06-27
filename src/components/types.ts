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

export const CATEGORY_COLORS = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "gray"
] as const

export type Color = (typeof CATEGORY_COLORS)[number]

export type Category = {
    id: number
    name: string
    color: Color
    isEditing: boolean
}

export type Filter = "all" | "active" | "completed"