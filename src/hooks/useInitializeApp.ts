import { useEffect } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { Todo, Filter, Category } from "../components/types"
import { fetchTodos } from "../api/todoApi"
import { fetchCategory } from "../api/categoryApi"


function useInitializeApp(setTodos: Dispatch<SetStateAction<Todo[]>>, setCategories: Dispatch<SetStateAction<Category[]>>,
  filter: Filter){
 
   
    useEffect(() => {
      const fetch = async () => {
        try {
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
        } 
      }
      fetch()
    }, [])

    useEffect(() => {
      const fetch = async () => {
        try {
          const data = await fetchCategory()

          setCategories(data.map(category => ({
            id: category.id,
            name: category.name,
            color: category.color,
            isEditing: false
          })))
        } catch {
          alert("データの取得に失敗しました")
        } 
      }
      fetch()
    }, [])

    useEffect(() => {
      localStorage.setItem("filter", filter)
    }, [filter])
}

export default useInitializeApp