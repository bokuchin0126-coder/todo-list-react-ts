import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { DailyTodo, DailyCategory } from "../components/types"

function useCategory(setDailyTodos: Dispatch<SetStateAction<DailyTodo[]>>, setError: Dispatch<SetStateAction<string | null>>, 
    setLoading: Dispatch<SetStateAction<boolean>>, selectedDate: string) {

    
    const [dailyCategories, setDailyCategories] = useState<DailyCategory[]>(() => {
      const saved = localStorage.getItem("categories")
      return saved ? JSON.parse(saved) : []
    })
    const [categoryName, setCategoryName] = useState<string>("")
    const currentDay = dailyCategories.find(category => category.date === selectedDate)
    const currentCategories = currentDay?.categories ?? []

    const handleAddCategory = () => {
      if (categoryName.trim() === "") return 
      setLoading(true)

      if (currentDay) {
        try {
          setDailyCategories(prev => prev.map(day => {
            if (day.date !== selectedDate) {
              return day
            }
            return {
              ...day,
              categories: [...day.categories, {
                id: Date.now(),
                name: categoryName
              }]
            }
          }))
          setCategoryName("")
        } catch {
          setError("カテゴリーの追加に失敗しました")
        } finally {
          setError(null)
          setLoading(false)
        }
      } else {
        setDailyCategories(prev => [
          ...prev,
          {
            date: selectedDate,
            categories: [
              {
                id: Date.now(),
                name: categoryName
              }
            ]
          }
        ])
    }
    setCategoryName("")
  }

  const handleDeleteCategory = (id: number) => {
    setLoading(true)

    try {
      setDailyCategories(prev => prev.map(day => {
        if (day.date !== selectedDate) {
          return day
        }
        return {
          ...day,
          categories: day.categories.filter(category => category.id !== id)
        }
      }))

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
      dailyCategories,
      categoryName,
      currentCategories,
      setCategoryName,
      handleAddCategory,
      handleDeleteCategory
  }
}


export default useCategory