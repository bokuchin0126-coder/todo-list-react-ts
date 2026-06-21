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
  updateTodoText
} from "../api/todoApi"

function useTodo(setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>>, errorTime: () => void ) {
    const [todos, setTodos] = useState<Todo[]>([])
    const [inputText, setInputText] = useState<string>("")
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

    const handleAddTodo = async () => {
    if (!inputText.trim()) return
    
    setLoading(true)
    try {
      const data = await createTodo(inputText, selectedCategoryId, selectedDate)

      const insertedTodo: Todo = {
        id: data.id,
        text: data.text,
        status: "active",
        isEditing: false,
        categoryId: selectedCategoryId,
        createdAt: data.created_at,
        todoDate: selectedDate
      }

      setTodos(prev => [...prev, insertedTodo])
      setInputText("")
    } catch (e) {
      setError("データの追加に失敗しました")
    } finally {
      setLoading(false)
      errorTime()
    }
  }

  const handleDeleteTodo = async (id: number) => {
    setLoading(true)
    try {
      await deleteTodo(id) 
     
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (e) {
      setError("データの消去に失敗しました")
    } finally {
      setLoading(false)
      errorTime()
    }
  }

  const handleToggleTodo = async (id: number) => {
    setLoading(true)
    const target = currentTodos.find(todo => todo.id === id)
    if (!target) return 

    try {
      const newStatus = target.status === "completed" ? "active" : "completed"

      await updateTodoStatus(id, newStatus)

      setTodos(prev => prev.map(todo => (
        todo.id === id ? {...todo, status: todo.status === "completed" ? "active" : "completed"} : todo
      )))
    } catch (e) {
      setError("データの更新に失敗しました")
    } finally {
      setLoading(false)
      errorTime()
    }
  }
  
    const handleToggleEdit = (id: number) => {
      setTodos(prev => prev.map(todo => (
        todo.id == id ? {...todo, isEditing: !todo.isEditing} : todo
      )))
    }
  
    const handleUpdateTodo = async (id: number, newText: string) => {
      setLoading(true)
      const target = currentTodos.find(todo => todo.id === id)
      if (!target) return

      try {
        await updateTodoText(id, newText)

        setTodos(prev => prev.map(todo => (
          todo.id === id ? {...todo, text: newText} : todo
        )))
      } catch {
        setError("編集に失敗しました")
      } finally {
        setLoading(false)
        errorTime()
      }
    }
  
    return {
        todos,
        selectedDate,
        today,
        setTodos,
        currentTodos,
        inputText,
        searchText,
        selectedCategoryId,
        setInputText,
        setSearchText,
        setSelectedCategoryId,
        handleAddTodo,
        handleToggleTodo,
        handleDeleteTodo,
        handleToggleEdit,
        handleUpdateTodo,
        changeDate
    }
}

export default useTodo