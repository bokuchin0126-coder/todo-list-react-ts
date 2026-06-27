import { useEffect } from "react"
import type { Dispatch, SetStateAction } from 'react'
import { supabase } from "../lib/supabase"
import type { Todo, Filter, Category } from "../components/types"
import { fetchTodos } from "../api/todoApi"


function useInitializeApp(setTodos: Dispatch<SetStateAction<Todo[]>>, setCategories: Dispatch<SetStateAction<Category[]>>,
  filter: Filter, selectedCategoryId: number, setLoading: Dispatch<SetStateAction<boolean>>){
 
   
    useEffect(() => {
      const fetch = async () => {
        try {
          setLoading(true)
          const data = await fetchTodos()
          setTodos(data.map(todo => ({
            id: todo.id,
            text: todo.text,
            status: todo.status,
            isEditing: false,
            categoryId: todo.category_id,
            createdAt: todo.created_at,
            updatedAt: todo.updated_at,
            memo: todo.memo,
            todoDate: todo.todo_date
          })))

        } catch {
          alert("データの取得に失敗しました")
        } finally {
          setLoading(false)
        }
      }
      fetch()
    }, [])

    useEffect(() => {
      const fetch = async () => {
        try {
          setLoading(true)
          const { data, error } = await supabase
            .from("categories")
            .select("*")

          if (error) throw error
          setCategories(data.map(category => ({
            id: category.id,
            name: category.name,
            color: category.color,
            isEditing: false
          })))
        } catch {
          alert("データの取得に失敗しました")
        } finally {
          setLoading(false)
        }
      }
      fetch()
    }, [])

    useEffect(() => {
      localStorage.setItem("filter", filter)
    }, [filter])

    useEffect(() => {
      localStorage.setItem("selectedCategoryId", String(selectedCategoryId))
    }, [selectedCategoryId])
}

export default useInitializeApp