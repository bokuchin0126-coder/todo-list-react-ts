import type { Todo } from "../components/types"
import { supabase } from "../lib/supabase"


export async function createTodo(text: string, categoryId: number, selectedDate: string) {
    const { data, error } = await supabase
      .from("todos")
      .insert({
        text: text,
        status: "active",
        category_id: categoryId,
        todo_date: selectedDate
      })
      .select()

      if (error) throw error

      return data[0]
}

export async function deleteTodo(id: number) {
    const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)

    if (error) throw error
}

export async function updateTodoStatus(id: number, status: "completed" | "active") {
    const { error } = await supabase
        .from("todos")
        .update({
            status: status
        })
        .eq("id", id)
    
    if (error) throw error
}

export async function updateTodoText(id: number, newText: string) {
    const { error } = await supabase
        .from("todos")
        .update({
            text: newText
        })
        .eq("id", id)

    if (error) throw error
}

export async function fetchTodos() {
    const { data, error } = await supabase
            .from("todos")
            .select("*")

    if (error) throw error

    return data
}