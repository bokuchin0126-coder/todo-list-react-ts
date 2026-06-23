import { createContext } from "react"
import type { Todo, Category } from "../components/types"

type TodoContextType = {
  todos: Todo[]
  categories: Category[]
  today: string
  error: string | null
  selectedDate: string
  handleDeleteTodo: (id: number) => void
  handleToggleTodo: (id: number) => void
  handleEditTodo: (id: number) => void
  handleUpdateTextTodo: (id: number, text: string) => void
  handleUpdateMemoTodo: (id: number, memo: string) => void
}

export const TodoContext = createContext<TodoContextType | null>(null)