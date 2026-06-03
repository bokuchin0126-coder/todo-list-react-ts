import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { DailyTodo, Category } from "../components/types"

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
        setCategories(prev => [...prev, {
          id: Date.now(),
          name: categoryName,
          isEditing: false
        }])

        setCategoryName("")
      } catch {
        setError("カテゴリーの追加に失敗しました")
      } finally {
        setError(null)
        setLoading(false)
      }
    } 

    const handleKeepCategory = (id: number, text: string) => {
      try {
        setCategories(prev => prev.map(category => (
          category.id === id ? {...category, name: text, isEditing: false} : category
        )))
      } catch {
        setError("保存に失敗しました")
      } finally {
        setError(null)
      }
    }
   
    const handleEditCategory = (id: number) => {
      try {
        setCategories(prev => prev.map(category => (
          category.id === id ? {...category, isEditing: true} : category
        )))
      } catch {
        setError("編集に失敗しました")
      } finally {
        setError(null)
      }
    }


  return {
      categories,
      setCategories,
      categoryName,
      setCategoryName,
      handleAddCategory,
      handleEditCategory,
      handleKeepCategory
  }
}


export default useCategory