import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { Todo, Filter } from "../components/types"

function useTodo(filter: Filter, setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>> ) {
    const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos")
      return saved ? JSON.parse(saved) : []
    })
    const [inputText, setInputText] = useState<string>("")
    const [searchText, setSearchText] = useState<string>("")
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)


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

      setTodos(prev => [...prev, newTodo])
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
      setTodos(prev => prev.filter(todo => todo.id !== id)) 
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
      const target = todos.find(t => t.id ===id)
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
      const date = await res.json()

      setTodos(prev => prev.map(t => (
        t.id === id ? {...t, status: t.status === "completed" ? "active" : "completed"} : t
      )))

    } catch (e) {
      setError("データの更新に失敗しました")
    } finally {
      setLoading(false)
      setError(null)
    }
  }
  
    const handleToggleEdit = (id: number) => {
      setTodos(prev => prev.map(todo => 
        todo.id === id ? {...todo, isEditing: !todo.isEditing} : todo
      ))
    }
  
    const handleUpdateTodo = (id: number, newText: string) => {
      setTodos(prev => prev.map(todo => 
        todo.id === id ? {...todo, text: newText } : todo
      ))
    }
  
    return {
        todos,
        setTodos,
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