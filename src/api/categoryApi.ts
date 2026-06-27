import { supabase } from "../lib/supabase"
import type { Color } from "../components/types"


export async function createCategory(categoryName: string, color: Color) {
    const { data, error } = await supabase
        .from("categories")
        .insert({
            name: categoryName,
            color: color
        })
        .select()

    if (error) throw error

    return data[0]
}

export async function keepTextCategory(id: number, text: string) {
    const { error } = await supabase
        .from("categories")
        .update({
            name: text
        })
        .eq("id", id)

    if (error) throw error
}

export async function keepColorCategory(id: number, color: Color) {
    const { error } = await supabase
        .from("categories")
        .update({
            color: color
        })
        .eq("id", id)

    if (error) throw error
}

export async function deleteCategory(id: number) {
    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)

    if (error) throw error
}