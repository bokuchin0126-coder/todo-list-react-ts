import type { View, Category, Todo } from '../types'
import {useState} from 'react'

type Props = {
  todos: Todo[]
  selectedCategoryId: number | null
  setSelectedCategoryId: (number: number) => void
  view: View
  setView: (view: View) => void
}

function TodoDetailView({ todos, selectedCategoryId, setSelectedCategoryId, view, setView }: Props) {

  const [categories, setCategories] = useState<Category[]>([
      { id: 1, name: "勉強"},
      { id: 2, name: "筋トレ"}
    ])

  function getProgressByCategory(todos: Todo[], categoryId: number) {

    const todosInCategory =  todos.filter(
      (todo) => todo.categoryId === categoryId
    )

    const completedCount = todosInCategory.filter(
      (todo) => todo.status === "completed"
    ).length

    if (todosInCategory.length === 0) return "未開始"

    return Math.floor((completedCount / todosInCategory.length) * 100) + "%"
  }

    return (
        <div className="detail">
          <h2>カテゴリ</h2>

          <div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryId(cat.id)
                  setView("list")
                }}
              >{cat.name} ({getProgressByCategory(todos, cat.id)})</button>
            ))}
          </div>
        </div>
    )
}

export default TodoDetailView