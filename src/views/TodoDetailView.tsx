import type { View, DailyCategory, DailyTodo, Category } from '../components/types'

type Props = {
  dailyCategories: DailyCategory[]
  dailyTodos: DailyTodo[]
  categoryName: string
  currentCategories: Category[]
  selectedDate: string
  setSelectedCategoryId: (number: number) => void
  setView: (view: View) => void
  setCategoryName: (name: string) => void
  onAddCategory: () => void
  onDeleteCategory: (id: number) => void
  onChangeDate: (number: number) => void
}

function TodoDetailView({ dailyCategories, dailyTodos, categoryName, currentCategories, selectedDate, setSelectedCategoryId, setView, setCategoryName,
   onAddCategory, onDeleteCategory, onChangeDate }: Props) {

  function getProgressByCategory(categoryId: number) {

    const todayDate = dailyTodos.find(day => day.date === selectedDate)

    const todosInCategory = todayDate?.todos.filter(todo => todo.categoryId === categoryId) ?? []

    const completedCount = todosInCategory.filter(todo => todo.status === "completed").length

    if (todosInCategory.length === 0) return "未開始"

    return Math.floor((completedCount / todosInCategory.length) * 100) + "%"
  }

    return (
        <div className="detail">
          <h2>カテゴリ</h2>

          <div className="date-control">
            <button onClick={() => onChangeDate(-1)}>←</button>
            <h3>{selectedDate}</h3>
            <button onClick={() => onChangeDate(1)}>→</button>
          </div>
          <div>
            <input
              value={categoryName}
              autoFocus
              placeholder={"カテゴリーを追加..."}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === "Enter") {
                  onAddCategory()
                }
              }}
            />
            <button onClick={() => onAddCategory}>追加</button>
          </div>
          <div>
            {currentCategories.map((category: Category) => (
              <div key={category.id}>
                <button onClick={() => {setSelectedCategoryId(category.id), setView("list")}}>
                  {category.name}{getProgressByCategory(category.id)}
                </button>
                <button onClick={() => onDeleteCategory(category.id)}>
                  消去
                </button>
              </div>
            ))}
          </div>
        </div>
    )
}

export default TodoDetailView