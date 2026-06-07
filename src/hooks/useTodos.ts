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
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "DELETE"
      })
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
    try {
      const target = currentTodos.find(day => day.id === id)
      if (!target) return 

      const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: target.status !== "completed" 
        })
      })

      setDailyTodos(prev => prev.map(day => {
        if (day.date !== selectedDate) {
          return day
        }
        return {
          ...day,
          todos: day.todos.map(todo => (
            todo.id === id ? {...todo, status: todo.status === "completed" ? "active" : "completed"} : todo
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
  
    const handleUpdateTodo = (id: number, newText: string) => {
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