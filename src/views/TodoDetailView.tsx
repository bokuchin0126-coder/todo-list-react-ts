import type { DailyCategory, Category } from '../components/types'
import { Link } from "react-router-dom" 
import { TodoContext } from "../context/TodoContext"
import { useContext } from "react" 

type Props = {
  dailyCategories: DailyCategory[]
  categoryName: string
  currentCategories: Category[]
  setSelectedCategoryId: (number: number) => void
  setCategoryName: (name: string) => void
  handleAddCategory: () => void
  handleDeleteCategory: (id: number) => void
  handleChangeDate: (number: number) => void
}

function TodoDetailView({ dailyCategories, categoryName, currentCategories, setSelectedCategoryId, setCategoryName,
   handleAddCategory, handleDeleteCategory, handleChangeDate }: Props) {

    const todoContext = useContext(TodoContext)
    if (!todoContext) return null

    const { dailyTodos, selectedDate } = todoContext

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
            <button onClick={() => handleChangeDate(-1)}>←</button>
            <h3>{selectedDate}</h3>
            <button onClick={() => handleChangeDate(1)}>→</button>
          </div>
          <div>
            <input
              value={categoryName}
              autoFocus
              placeholder={"カテゴリーを追加..."}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === "Enter") {
                  handleAddCategory()
                }
              }}
            />
            <button onClick={() => handleAddCategory}>追加</button>
          </div>
          <div>
            {currentCategories.map((category: Category) => (
              <div key={category.id}>

                <Link to="/list">
                  <button onClick={() => {setSelectedCategoryId(category.id)}}>
                    {category.name}{getProgressByCategory(category.id)}
                  </button>
                </Link>

                <button onClick={() => handleDeleteCategory(category.id)}>
                  消去
                </button>
              </div>
            ))}
          </div>
        </div>
    )
}

export default TodoDetailView