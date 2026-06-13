import { useEffect } from "react"
import type { Dispatch, SetStateAction } from 'react'
import { supabase } from "../lib/supabase"
import type { Todo, Filter, Category } from "../components/types"


function useInitializeApp(setTodos: Dispatch<SetStateAction<Todo[]>>, categories: Category[], filter: Filter, selectedCategoryId: number, 
  setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>>, selectedDate: string, today: string){

   
    useEffect(() => {
      const fetch = async () => {
        try {
          setLoading(true)
          const { data, error } = await supabase
            .from("todos")
            .select("*")

          if (error) throw error
          setTodos(data.map(todo => ({
            id: todo.id,
            text: todo.text,
            status: todo.status,
            isEditing: todo.isEditing,
            categoryId: todo.category_id.toString(),
            createdAt: todo.created_at,
            todoDate: todo.todo_date
          })))
          
        } catch {
          setError("データの取得に失敗しました")
        } finally {
          setLoading(false)
        }
      }
      fetch()
    }, [])

    useEffect(() => {
      if (categories.length === 0) return
    localStorage.setItem("categories", JSON.stringify(categories))
    }, [categories])

    useEffect(() => {
      localStorage.setItem("filter", filter)
    }, [filter])
}

export default useInitializeApp