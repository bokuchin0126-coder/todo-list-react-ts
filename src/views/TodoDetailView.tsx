import type { Category } from '../components/types'
import { Link } from "react-router-dom" 
import { TodoContext } from "../context/TodoContext"
import { useContext, useState } from "react" 

type Props = {
  inputText: string
  categories: Category[]
  categoryName: string
  setSelectedCategoryId: (number: number) => void
  setCategoryName: (name: string) => void
  handleAddCategory: () => void
  handleChangeDate: (number: number) => void
  handleEditCategory: (id: number) => void
  handleKeepCategory: (id: number, text: string) => void
}

function TodoDetailView({ inputText, categories, categoryName, setSelectedCategoryId, setCategoryName, handleEditCategory,
   handleAddCategory, handleChangeDate, handleKeepCategory }: Props) {

    const todoContext = useContext(TodoContext)
    if (!todoContext) return null

    const { todos, selectedDate, error } = todoContext

    const [editText, setEditText] = useState<string>("")

  function getProgressByCategory(categoryId: number) {

    const todayDate = todos.filter(todo => todo.todoDate === selectedDate)

    const todosInCategory = todayDate.filter(todo => todo.categoryId === categoryId) ?? []

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
          {error && <p>{error}</p>}
          <div>
            {categories.map((category: Category) => (
              <div key={category.id}>

                

               {category.isEditing ?
               <div>
                <input
                  value={editText}
                  autoFocus
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleKeepCategory(category.id, editText)
                    }
                  }}
                />

               
                <button onClick={() => {handleKeepCategory(category.id, editText)}}>
                  保存
                </button>
              </div> : 

              <div>
                <Link to="/list">
                  <button onClick={() => {setSelectedCategoryId(category.id)}}>
                    {category.name}{getProgressByCategory(category.id)}
                  </button>
                </Link>
                  <button onClick={() => {handleEditCategory(category.id), setEditText(category.name)}}>編集</button>
              </div>}
            </div>
          ))}
        </div>

        <Link to="/stats">達成率一覧</Link>
      </div>
    )
}

export default TodoDetailView