import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vxikyrnelogplohjgpcs.supabase.co"
const supabaseKey = "sb_publishable_lmVE_uPpJtzEqHNAZL-J5g__mECtW9r"

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
)
