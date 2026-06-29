import { supabase } from "../lib/supabase"


export async function createTodo(text: string, memo: string, categoryId: number, selectedDate: string) {
    const { data, error } = await supabase
      .from("todos")
      .insert({
        text: text,
        status: "active",
        memo: memo,
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
    const { data, error } = await supabase
        .from("todos")
        .update({
            status: status,
            updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
    
    if (error) throw error

    return data[0]
}

export async function updateTodoText(id: number, newText: string) {
    const { data, error } = await supabase
        .from("todos")
        .update({
            text: newText,
            updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()

    if (error) throw error

    return data[0]
}

export async function updateTodoMemo(id: number, memo: string) {
    const { data, error } = await supabase
      .from("todos")
      .update({
        memo: memo,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()

    if (error) throw error

    return data[0]
}

export async function updateCatoryId(id: number, categoryId: number) {
    const { data, error } = await supabase
      .from("todos")
      .update({
        category_id: categoryId,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()

    if (error) throw error

    return data[0]
}

export async function fetchTodos() {
    const { data, error } = await supabase
            .from("todos")
            .select("*")

    if (error) throw error

    return data
}