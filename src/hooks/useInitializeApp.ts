import { useEffect } from "react"
import type { Dispatch, SetStateAction } from 'react'
import type { ApiTodo, Filter, DailyTodo, Category } from "../components/types"


function useInitializeApp(dailyTodos: DailyTodo[], categories: Category[], filter: Filter, selectedCategoryId: number, setDailyTodos: Dispatch<SetStateAction<DailyTodo[]>>,
  setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>>, selectedDate: string, setCategories: Dispatch<SetStateAction<Category[]>>){

    useEffect(() => {
      setLoading(true)

      const saved = localStorage.getItem("todos")
      if (saved) {
        const parsed = JSON.parse(saved)

        const todayDate = parsed.find(
          (day: DailyTodo) => day.date === selectedDate
        )

        if (!todayDate) {
          const newDailyTodo: DailyTodo = {
            date: selectedDate,
            todos: []
          }
          parsed.push(newDailyTodo)

          localStorage.setItem("todos", JSON.stringify(parsed))
        } 
        setDailyTodos(parsed)

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

          setDailyTodos(firstDate)
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
      localStorage.setItem("todos", JSON.stringify(dailyTodos))
    }, [dailyTodos])

    useEffect(() => {
      if (categories.length === 0) return
    localStorage.setItem("categories", JSON.stringify(categories))
    }, [categories])

    useEffect(() => {
      localStorage.setItem("filter", filter)
    }, [filter])
}

export default useInitializeApp