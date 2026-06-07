import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { DailyTodo, Todo } from "../components/types"
import { supabase } from "../lib/supabase"

function useTodo(setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>> ) {
    const [dailyTodos, setDailyTodos] = useState<DailyTodo[]>(() => {
      const saved = localStorage.getItem("todos")
      return saved ? JSON.parse(saved) : []
    })
    const [inputText, setInputText] = useState<string>("")
    const [searchText, setSearchText] = useState<string>("")
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date())

    const todayDate = async () => {
      const { data, error } = await supabase
        .from("todo")
        .select()

      const date = new Date(data?.[0].created_at)
      const japanDate = date.toLocaleDateString("en-CA", {
        timeZone: "Asia/Tokyo"
      })
      return japanDate
    }
  
    const [selectedDate, setSelectedDate] = useState(today)
    const currentDay = dailyTodos.find(day => day.date === selectedDate)
    const currentTodos = currentDay?.todos ?? []

    const changeDate = (number: number) => {
      const date = new Date(selectedDate)
      date.setDate(date.getDate() + number)

      const formatted = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(date)

      if (number >= 0)  if (selectedDate >= today) return today
      
      setSelectedDate(formatted)
    }

    const handleAddTodo = async () => {
    if (!inputText.trim()) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([{
          text: inputText,
          status: "active",
          category_id: selectedCategoryId
        }])
        .select()
      console.log(data?.[0])
      if (!data) return error

      const insertedTodo: Todo = {
        id: data[0].id,
        text: data[0].text,
        status: "active",
        isEditing: false,
        categoryId: data[0].category_id
      }

      setDailyTodos(prev => prev.map(day => {
        if (day.date !== selectedDate) {
          return day
        }
        return {
          ...day,
          todos: [...day.todos, insertedTodo]
        }
      }))
      setInputText("")
    } catch (e) {
      setError("データの追加に失敗しました")
    } finally {
      setLoading(false)
      setError(null)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
      
      setDailyTodos(prev => prev.map(day => {
        if (day.date !== selectedDate) {
          return day
        }
        return {
          ...day,
          todos: day.todos.filter(todo => todo.id !== id)
        }
      }))

    } catch (e) {
      setError("データの消去に失敗しました")
    } finally {
      setLoading(false)
      setError(null)
    }
  }

  const handleToggleTodo = async (id: number) => {
    setLoading(true)
    const target = currentTodos.find(todo => todo.id === id)
    if (!target) return 

    try {
      const newStatus = target.status === "completed" ? "active" : "completed"

      const { error } = await supabase
        .from("todos")
        .update({
          status: newStatus
        })
        .eq("id", id)

      setDailyTodos(prev => prev.map(day => {
        if (day.date !== selectedDate) {
          return day
        }
        return {
          ...day,
          todos: day.todos.map(todo => (
            todo.id === id ? {...todo, status: newStatus} : todo
          ))
        }
      }))
    } catch (e) {
      setError("データの更新に失敗しました")
    } finally {
      setLoading(false)
      setError(null)
    }
  }
  
    const handleToggleEdit = (id: number) => {
      setDailyTodos(prev => prev.map(day => {
        if (day.date !== selectedDate) {
          return day
        }
        return {
          ...day,
          todos: day.todos.map(todo => (
            todo.id === id ? {...todo, isEditing: !todo.isEditing} : todo
          ))
        }
      }))
    }
  
    const handleUpdateTodo = async (id: number, newText: string) => {
      setLoading(true)
      const target = currentTodos.find(todo => todo.id === id)
      if (!target) return

      try {
        const { error } = await supabase
          .from("todo")
          .update({
            text: newText
          })

        setDailyTodos(prev => prev.map(day => {
          if (day.date !== selectedDate) {
            return day
          }
          return {
            ...day,
            todos: day.todos.map(todo => (
              todo.id === id ? {...todo, text: newText} : todo
            ))
          }
        }))
      } catch {
        setError("編集に失敗しました")
      } finally {
        setError(null)
        setLoading(false)
      }
    }
  
    return {
        dailyTodos,
        selectedDate,
        today,
        setDailyTodos,
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