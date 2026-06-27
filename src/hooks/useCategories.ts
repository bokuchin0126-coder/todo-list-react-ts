import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { Todo, Category, Color } from "../components/types"
import { supabase } from "../lib/supabase"
import { createCategory, keepTextCategory, keepColorCategory, deleteCategory} from "../api/categoryApi"

function useCategory(setLoading: Dispatch<SetStateAction<boolean>>) {

    
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryName, setCategoryName] = useState<string>("")

    const handleAddCategory = async (color: Color) => {
      if (categoryName.trim() === "") return 
      
      try {
        setLoading(true)
        const data = await createCategory(categoryName, color)

        setCategories(prev => [...prev, {
          id: data.id,
          name: data.name,
          color: color,
          isEditing: false
        }])

        setCategoryName("")
      } catch {
        alert("カテゴリーの追加に失敗しました")
      } finally {
        setLoading(false)
      }
    } 

    const handleKeepTextCategory = async (id: number, text: string) => {
      try {
        setLoading(true)
        await keepTextCategory(id, text)

        setCategories(prev => prev.map(category => (
          category.id === id ? {...category, name: text, isEditing: false} : category
        )))

      } catch {
        alert("保存に失敗しました")
      } finally {
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
        alert("編集に失敗しました")
      } 
    }

    const handleKeepColorCategory = async (id: number, color: Color) => {
      try {
        setLoading(true)
        await keepColorCategory(id, color)

        setCategories(prev => prev.map(category => (
          category.id === id ? {...category, color: color} : category
        )))
      } catch {
        alert("編集に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    const handleDeleteCategory = async (id: number) => {
      try {
        setLoading(true)
        await deleteCategory(id)

        setCategories(prev => prev.filter(category => category.id !== id))
      } catch {
        alert("削除に失敗しました")
      } finally {
        setLoading(false)
      }
    }


  return {
      categories,
      setCategories,
      categoryName,
      setCategoryName,
      handleAddCategory,
      handleEditCategory,
      handleKeepTextCategory,
      handleKeepColorCategory,
      handleDeleteCategory
  }
}


export default useCategory