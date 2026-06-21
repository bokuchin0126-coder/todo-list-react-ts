import { supabase } from "../lib/supabase"


export async function createCategory(categoryName: string) {
    const { data, error } = await supabase
        .from("categories")
        .insert({
            name: categoryName
        })
        .select()

    if (error) throw error

    return data[0]
}

export async function keepCategory(id: number, text: string) {
    const { error } = await supabase
        .from("categories")
        .update({
            name: text
        })
        .eq("id", id)

    if (error) throw error
}