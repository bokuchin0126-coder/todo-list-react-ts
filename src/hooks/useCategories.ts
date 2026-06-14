import { useState } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { Todo, Category } from "../components/types"
import { supabase } from "../lib/supabase"

function useCategory(setError: Dispatch<SetStateAction<string | null>>, 
    setLoading: Dispatch<SetStateAction<boolean>>, selectedDate: string, errorTime: () => void) {

    
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryName, setCategoryName] = useState<string>("")

    const handleAddCategory = async () => {
      if (categoryName.trim() === "") return 
      
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("categories")
          .insert({
            name: categoryName
          })
          .select()

        if (error) {
          console.log(error)
          throw error
        }
        setCategories(prev => [...prev, {
          id: data[0].id,
          name: data[0].name,
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
        const { error } = await supabase
          .from("categories")
          .update({
            name: text
          })
          .eq("id", id)

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