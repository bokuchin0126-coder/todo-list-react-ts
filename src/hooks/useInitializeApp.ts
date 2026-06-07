import { useEffect } from "react"
import type { Dispatch, SetStateAction } from 'react'
import { supabase } from "../lib/supabase"
import type { ApiTodo, Filter, DailyTodo, Category } from "../components/types"


function useInitializeApp(dailyTodos: DailyTodo[], categories: Category[], filter: Filter, selectedCategoryId: number, setDailyTodos: Dispatch<SetStateAction<DailyTodo[]>>,
  setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>>, selectedDate: string, setCategories: Dispatch<SetStateAction<Category[]>>){

    useEffect(() => {
      setLoading(true)


      const fetchDate = async () => {
        try {
          const { data, error } = await supabase
            .from("todos")
            .select("*")

          const Todo = data?.map(todo => ({
            id: todo.id,
            text: todo.text,
            status: todo.status,
            isEditing: false,
            categoryId: todo.category_id
          }))

          setDailyTodos([{
            date: selectedDate,
            todos: Todo ?? []
          }])


        } catch (e) { 
          setError("データの取得に失敗しました")
        } finally {
          setLoading(false)
          setError(null)
        }
      }
      fetchDate()
    }, [selectedDate])

    useEffect(() => {
      if (categories.length === 0) return
    localStorage.setItem("categories", JSON.stringify(categories))
    }, [categories])

    useEffect(() => {
      localStorage.setItem("filter", filter)
    }, [filter])
}

export default useInitializeApp