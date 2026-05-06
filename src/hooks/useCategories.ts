import { useState } from "react"
import type { Category, View } from "../components/types"

function useCategory() {
    const [view, setView] = useState<View>("detail")
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
}