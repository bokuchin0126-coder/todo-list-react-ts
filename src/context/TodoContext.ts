import { createContext } from "react"
import type { Todo, DailyTodo } from "../components/types"

type TodoContextType = {
  dailyTodos: DailyTodo[]
  selectedDate: string
  handleDeleteTodo: (id: number) => void
  handleToggleTodo: (id: number) => void
  handleToggleEdit: (id: number) => void
  handleUpdateTodo: (id: number, text: string) => void
}

export const TodoContext = createContext<TodoContextType | null>(null)