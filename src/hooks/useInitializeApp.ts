import { useEffect } from "react"
import type { Dispatch, SetStateAction } from 'react'
import { supabase } from "../lib/supabase"
import type { ApiTodo, Filter, Category } from "../components/types"


function useInitializeApp(categories: Category[], filter: Filter, selectedCategoryId: number, 
  setError: Dispatch<SetStateAction<string | null>>, setLoading: Dispatch<SetStateAction<boolean>>, selectedDate: string, today: string){

   

    useEffect(() => {
      if (categories.length === 0) return
    localStorage.setItem("categories", JSON.stringify(categories))
    }, [categories])

    useEffect(() => {
      localStorage.setItem("filter", filter)
    }, [filter])
}

export default useInitializeApp