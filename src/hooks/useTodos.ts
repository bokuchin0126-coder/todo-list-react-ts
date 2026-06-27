import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { Todo } from "../components/types"
import { supabase } from "../lib/supabase"
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

function useTodo(setLoading: Dispatch<SetStateAction<boolean>>) {

    const [todos, setTodos] = useState<Todo[]>([])
    const [searchText, setSearchText] = useState<string>("")

    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(() => {
      const saved = localStorage.getItem("selectedCategoryId")
      return saved ? Number(saved) : 0
    })

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
    if (!text.trim()) return
    
    setLoading(true)
    try {
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
      alert("データの追加に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    setLoading(true)
    try {
      await deleteTodo(id) 
     
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (e) {
      alert("データの消去に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTodo = async (id: number) => {
    setLoading(true)
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
      alert("データの更新に失敗しました")
    } finally {
      setLoading(false)
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
        setLoading(true)
        const data = await updateTodoText(id, newText)

        setTodos(prev => prev.map(todo => (
          todo.id === id ? {
            ...todo, 
            text: newText,
            updatedAt: data.updated_at
          } : todo
        )))
      } catch {
        alert("編集に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    const handleUpdateMemoTodo = async (id: number, memo: string) => {
      const target = currentTodos.find(todo => todo.id === id)
      if (!target) return

      try {
        setLoading(true)
        const data = await updateTodoMemo(id, memo)

        setTodos(prev => prev.map(todo => (
          todo.id === id ? {
            ...todo, 
            memo: memo,
            updatedAt: data.updated_at
          } : todo
        )))
      } catch {
        alert("編集に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    const handleUpdateCategoryTodo = async (id: number, categoryId: number) => {
      const target = currentTodos.find(todo => todo.id === id)
      if (!target) return

      try {
        setLoading(true)
        const data = await updateCatoryId(id, categoryId)

        setTodos(prev => prev.map(todo => (
          todo.id === id ? {
            ...todo, 
            categoryId: data.category_id,
            updatedAt: data.updated_at
          } : todo
        )))
      } catch {
        alert("編集に失敗しました")
      } finally {
        setLoading(false)
      }
    }
  
    return {
        todos,
        selectedDate,
        today,
        setTodos,
        currentTodos,
        searchText,
        selectedCategoryId,
        setSearchText,
        setSelectedCategoryId,
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