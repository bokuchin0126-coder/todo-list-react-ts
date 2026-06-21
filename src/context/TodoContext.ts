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
  handleToggleEdit: (id: number) => void
  handleUpdateTodo: (id: number, text: string) => void
}

export const TodoContext = createContext<TodoContextType | null>(null)