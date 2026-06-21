import { Link, useNavigate } from "react-router-dom" 
import type { Category } from "../components/types"
import { TodoContext } from "../context/TodoContext"
import { useContext, useState } from "react"
import "../css/todo-detail.css" 

type Props = {
  handleAddTodo: (text: string) => void
}

function TodoDetailView({ handleAddTodo }: Props) {

  const todoContext = useContext(TodoContext)
  if (!todoContext) return null
  
  const { todos, categories, handleDeleteTodo, handleToggleTodo, handleUpdateTodo, handleToggleEdit } = todoContext

  const navigate = useNavigate()

  const [title, setTitle] = useState<string>("")
  const [memo, setMemo] = useState<string>("")
  const [categoryId, setCategoryId] = useState<number>(1)

  const handleSave = () => {
    handleAddTodo(title)
    navigate("/list")
    setTitle("")
  }

  return (
    <>
      <div className="detail-page">

        <div className="detail-header">

          <Link to="/list">
            <button>← 戻る</button>
          </Link>

          <h1>タスク詳細</h1>

          {todos.map(todo => (
            <button onClick={() => handleDeleteTodo(todo.id)}>
              削除
            </button>
          ))}
        </div>

        <div className="detail-card">

          <input
            className="detail-title"
            placeholder="タスク名"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave()
              }
            }}
          />

          <select>
            {categories.map(category => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <textarea
            className="detail-memo"
            placeholder="メモを入力"
          />

          <div className="detail-actions">

            <Link to="/list">
              <button onClick={handleSave}>
                保存
              </button>
            </Link>

            {todos.map(todo => (
            <button onClick={() => handleToggleTodo(todo.id)}>
              完了にする
            </button>
          ))}

          </div>
        </div>

      </div>
    </>
  )
}

export default TodoDetailView