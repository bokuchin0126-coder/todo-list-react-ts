import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { DailyTodo, Todo } from "../components/types"

function useTodo(setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>> ) {
    const [dailyTodos, setDailyTodos] = useState<DailyTodo[]>(() => {
      const saved = localStorage.getItem("todos")
      return saved ? JSON.parse(saved) : []
    })
    const [inputText, setInputText] = useState<string>("")
    const [searchText, setSearchText] = useState<string>("")
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
    const today = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date())
    const todayDate = dailyTodos.find(day => day.date === today)
    const todayTodos = todayDate?.todos ?? []


    const handleAddTodo = async () => {
    if (!inputText.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: inputText,
          completed: false
        })
      })
      const date = await res.json()

      const newTodo: Todo = {
        id: Date.now(),
        text: date.title,
        status: "active",
        isEditing: false,
        categoryId: selectedCategoryId
      }

      setDailyTodos(prev => prev.map(day => {
        if (day.date !== today) {
          return day
        }
        return {
          ...day,
          todos: [...day.todos, newTodo]
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
        if (day.date !== today) {
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
      const target = todayTodos.find(day => day.id === id)
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
        if (day.date !== today) {
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
        if (day.date !== today) {
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
        if (day.date !== today) {
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
        today,
        setDailyTodos,
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
        handleUpdateTodo
    }
}

export default useTodo