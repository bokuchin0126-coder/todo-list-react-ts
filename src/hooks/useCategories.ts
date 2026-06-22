import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { Todo, Category } from "../components/types"
import { supabase } from "../lib/supabase"
import { createCategory, keepCategory} from "../api/categoryApi"

function useCategory(setError: Dispatch<SetStateAction<string | null>>, 
    setLoading: Dispatch<SetStateAction<boolean>>, errorTime: () => void) {

    
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryName, setCategoryName] = useState<string>("")

    const handleAddCategory = async () => {
      if (categoryName.trim() === "") return 
      
      try {
        setLoading(true)
        const data = await createCategory(categoryName)

        setCategories(prev => [...prev, {
          id: data.id,
          name: data.name,
          isEditing: false
        }])

        setCategoryName("")
      } catch {
        setError("カテゴリーの追加に失敗しました")
      } finally {
        errorTime()
        setLoading(false)
      }
    } 

    const handleKeepCategory = async (id: number, text: string) => {
      try {
        setLoading(true)
        await keepCategory(id, text)

        setCategories(prev => prev.map(category => (
          category.id === id ? {...category, name: text, isEditing: false} : category
        )))

      } catch {
        setError("保存に失敗しました")
      } finally {
        errorTime()
        setLoading(false)
      }
    }
   
    const handleEditCategory = (id: number) => {
      try {
        const isEditing = categories.filter(category => category.isEditing)
        if (isEditing.length > 0) return

        setCategories(prev => prev.map(category => (
          category.id === id ? {...category, isEditing: true} : category
        )))

      } catch {
        setError("編集に失敗しました")
      } finally {
        errorTime()
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