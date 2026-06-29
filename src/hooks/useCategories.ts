import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { Category, Color } from "../components/types"
import { createCategory, keepTextCategory, keepColorCategory, deleteCategory} from "../api/categoryApi"

function useCategory() {

    
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryName, setCategoryName] = useState<string>("")

    const handleAddCategory = async (color: Color) => {
      if (categoryName.trim() === "") return 
      
      try {
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
      } 
    } 

    const handleKeepTextCategory = async (id: number, text: string) => {
      try {
        await keepTextCategory(id, text)

        setCategories(prev => prev.map(category => (
          category.id === id ? {...category, name: text, isEditing: false} : category
        )))

      } catch {
        alert("保存に失敗しました")
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
        await keepColorCategory(id, color)

        setCategories(prev => prev.map(category => (
          category.id === id ? {...category, color: color} : category
        )))
      } catch {
        alert("編集に失敗しました")
      } 
    }

    const handleDeleteCategory = async (id: number) => {
      try {
        await deleteCategory(id)

        setCategories(prev => prev.filter(category => category.id !== id))
      } catch {
        alert("削除に失敗しました")
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