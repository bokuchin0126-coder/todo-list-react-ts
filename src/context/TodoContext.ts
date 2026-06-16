import { createContext } from "react"
import type { Todo } from "../components/types"

type TodoContextType = {
  todos: Todo[]
  today: string
  error: string | null
  selectedDate: string
  handleDeleteTodo: (id: number) => void
  handleToggleTodo: (id: number) => void
  handleToggleEdit: (id: number) => void
  handleUpdateTodo: (id: number, text: string) => void
}

export const TodoContext = createContext<TodoContextType | null>(null)