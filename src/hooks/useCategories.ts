import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { Category, DailyTodo } from "../components/types"

function useCategory(setDailyTodos: Dispatch<SetStateAction<DailyTodo[]>>, setError: Dispatch<SetStateAction<string | null>>, 
    setLoading: Dispatch<SetStateAction<boolean>>, selectedDate: string) {

    const [categories, setCategories] = useState<Category[]>(() => {
      const saved = localStorage.getItem("categories")
      return saved ? JSON.parse(saved) : []
    })
    const [categoryName, setCategoryName] = useState<string>("")

     const handleAddCategory = () => {
    if (categoryName.trim() === "") return 
 
    setLoading(true)
    try {
      setCategories(prev => [...prev, {id: Date.now(), name: categoryName}])
      setCategoryName("")
    } catch {
      setError("カテゴリーの追加に失敗しました")
    } finally {
      setError(null)
      setLoading(false)
    }
  }

  const handleDeleteCategory = (id: number) => {
    setLoading(true)

    try {
      setCategories(prev => prev.filter(category => category.id !== id))

      setDailyTodos(prev => prev.map(day => {
        if (day.date !== selectedDate) {
          return day
        }
        return {
          ...day,
          todos: day.todos.filter(todo => todo.id !== id)
        }
      }))
      
    } catch {
      setError("カテゴリーの消去に失敗しました")
    } finally {
      setError(null)
      setLoading(false)
    }
  }

  return {
      categories,
      categoryName,
      setCategoryName,
      handleAddCategory,
      handleDeleteCategory
  }
}

export default useCategory