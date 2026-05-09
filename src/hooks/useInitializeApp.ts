import { useEffect } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { ApiTodo, Todo, Filter, Category } from "../components/types"


function useInitializeApp(todos: Todo[], categories: Category[], filter: Filter, selectedCategoryId: number, setTodos: Dispatch<SetStateAction<Todo[]>>,
  setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>>){

  useEffect(() => {
      const saved = localStorage.getItem("todos")
      if (saved) {
        setTodos(JSON.parse(saved))
        setLoading(false)
        return
      }

      setLoading(true)
      const fetchDate = async () => {
        try {
          const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
          const date = await res.json()

          const converted = date.map((item: ApiTodo) => ({
            id: item.id,
            text: item.title,
            status: item.completed ? "completed" : "active",
            categoryId: selectedCategoryId
          }))
            setTodos(converted)
        } catch (e) { 
          setError("データの取得に失敗しました")
        } finally {
          setLoading(false)
          setError(null)
        }
      }

      fetchDate()
    }, [])

    useEffect(() => {
      if (todos.length === 0) return
      localStorage.setItem("todos", JSON.stringify(todos))
    }, [todos])

    useEffect(() => {
      if (categories.length === 0) return
    localStorage.setItem("categories", JSON.stringify(categories))
    }, [categories])

    useEffect(() => {
      localStorage.setItem("filter", filter)
    }, [filter])
}

export default useInitializeApp