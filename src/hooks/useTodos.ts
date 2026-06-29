import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { Todo } from "../components/types"
import { getChangeDate } from "../utils/dateUtils"
import { getTodosByDate } from "../utils/filterUtils"
import {
  createTodo,
  deleteTodo,
  updateTodoStatus,
  updateTodoMemo,
  updateTodoText,
  updateCatoryId
} from "../api/todoApi"

function useTodo() {

    const [todos, setTodos] = useState<Todo[]>([])
    const [searchText, setSearchText] = useState<string>("")

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date())
  
    const [selectedDate, setSelectedDate] = useState(today)

    const currentTodos = getTodosByDate(todos, selectedDate)

    const changeDate = (number: number) => {
      const newDate = getChangeDate(selectedDate, today, number)
      
      setSelectedDate(newDate)
    }

    const handleAddTodo = async (text: string, memo: string, categoryId: number) => {
    try {
      if (text.trim() === "") throw new Error("タスク名を入力してください")
      const data = await createTodo(text, memo, categoryId, selectedDate)

      const insertedTodo: Todo = {
        id: data.id,
        text: data.text,
        status: "active",
        memo: memo,
        isEditing: false,
        categoryId: data.category_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        todoDate: selectedDate
      }

      setTodos(prev => [...prev, insertedTodo])

    } catch (e) {

      if (e instanceof Error) {
        alert(`${e.message}`)
      } else {
        alert("予期せぬエラーが発生しました")
      }
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id) 
     
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (e) {
      alert("予期せぬエラーが発生しました")
    }
  }

  const handleToggleTodo = async (id: number) => {
    const target = currentTodos.find(todo => todo.id === id)
    if (!target) return 

    try {
      const newStatus = target.status === "completed" ? "active" : "completed"

      const data = await updateTodoStatus(id, newStatus)

      setTodos(prev => prev.map(todo => (
        todo.id === id ? {
          ...todo,
          status: data.status,
          updatedAt: data.updated_at
        } : todo
      )))
    } catch (e) {
      alert("予期せぬエラーが発生しました")
    } 
  }
  
    const handleEditTodo = (id: number) => {
      setTodos(prev => prev.map(todo => (
        todo.id == id ? {...todo, isEditing: !todo.isEditing} : todo
      )))
    }
  
    const handleUpdateTextTodo = async (id: number, newText: string) => {
      const target = currentTodos.find(todo => todo.id === id)
      if (!target) return

      try {
        const data = await updateTodoText(id, newText)

        setTodos(prev => prev.map(todo => (
          todo.id === id ? {
            ...todo, 
            text: newText,
            updatedAt: data.updated_at
          } : todo
        )))
      } catch {
        alert("予期せぬエラーが発生しました")
      } 
    }

    const handleUpdateMemoTodo = async (id: number, memo: string) => {
      const target = currentTodos.find(todo => todo.id === id)
      if (!target) return

      try {
        const data = await updateTodoMemo(id, memo)

        setTodos(prev => prev.map(todo => (
          todo.id === id ? {
            ...todo, 
            memo: memo,
            updatedAt: data.updated_at
          } : todo
        )))
      } catch {
        alert("予期せぬエラーが発生しました")
      } 
    }

    const handleUpdateCategoryTodo = async (id: number, categoryId: number) => {
      const target = currentTodos.find(todo => todo.id === id)
      if (!target) return

      try {
        const data = await updateCatoryId(id, categoryId)

        setTodos(prev => prev.map(todo => (
          todo.id === id ? {
            ...todo, 
            categoryId: data.category_id,
            updatedAt: data.updated_at
          } : todo
        )))
      } catch {
        alert("予期せぬエラーが発生しました")
      } 
    }
  
    return {
        todos,
        selectedDate,
        today,
        setTodos,
        currentTodos,
        searchText,
        setSearchText,
        handleAddTodo,
        handleToggleTodo,
        handleDeleteTodo,
        handleEditTodo,
        handleUpdateTextTodo,
        handleUpdateMemoTodo,
        handleUpdateCategoryTodo,
        changeDate
    }
}

export default useTodo