import { useEffect } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { ApiTodo, Todo, Filter, Category, DailyTodo } from "../components/types"


function useInitializeApp(todos: Todo[], categories: Category[], filter: Filter, selectedCategoryId: number, setTodos: Dispatch<SetStateAction<Todo[]>>,
  setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>>){

    useEffect(() => {
      setLoading(true)

      const saved = localStorage.getItem("todos")
      if (saved) {
        const parsed = JSON.parse(saved)

        const today = new Date().toISOString().split("T")[0]

        const todayDate = parsed.find(
          (day: DailyTodo) => day.date === today
        )

        if (todayDate) {
          setTodos(todayDate.todos)
        } else {
          const newDailyTodo: DailyTodo = {
            date: today,
            todos: []
          }

          parsed.push(newDailyTodo)

          localStorage.setItem("todos", JSON.stringify(parsed))
          setTodos([])
        }
        setLoading(false)
        return
      }

      const fetchDate = async () => {
        try {
          const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
          const date = await res.json()

          const converted = date.map((item: ApiTodo) => ({
            id: item.id,
            text: item.title,
            status: item.completed ? "completed" : "active",
            categoryId: null
          }))

          const today = new Date().toISOString().split("T")[0]

          const firstDate: DailyTodo[] = [
            {
              date: today,
              todos: converted
            }
          ]
          localStorage.setItem("todos", JSON.stringify(firstDate))

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