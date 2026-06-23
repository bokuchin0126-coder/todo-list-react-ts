import { Link, useNavigate, useParams } from "react-router-dom" 
import type { Category } from "../components/types"
import { TodoContext } from "../context/TodoContext"
import { useContext, useState, useEffect } from "react"
import "../css/todo-detail.css" 

type Props = {
  handleAddTodo: (text: string, memo: string, categoryId: number) => void
}

function TodoDetailView({ handleAddTodo }: Props) {

  const todoContext = useContext(TodoContext)
  if (!todoContext) return null
  
  const { todos, categories, handleDeleteTodo, handleToggleTodo, handleUpdateTextTodo,
     handleEditTodo, handleUpdateMemoTodo } = todoContext

  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = id !== undefined

  const [title, setTitle] = useState<string>("")
  const [memo, setMemo] = useState<string>("")

  const [categoryId, setCategoryId] = useState<number>(0)
  const targetTodo = todos.find(todo => todo.id === Number(id)) 


  const handleSave = () => {
    if (categoryId === 0) {
      alert("カテゴリを選択してください")
      return
    }
    else if (isEditMode && targetTodo) {
      handleUpdateTextTodo(targetTodo.id, title)
      handleUpdateMemoTodo(targetTodo.id, memo)
      handleEditTodo(targetTodo.id)
    }
    else {
      handleAddTodo(title, memo, categoryId)
      setTitle("")
    }
    navigate("/tasks")
  }

  const editCancell = () => {
    if (targetTodo) {
      handleEditTodo(targetTodo.id)
    }
  }

  useEffect(() => {
    if (targetTodo) {
      setTitle(targetTodo.text)
      setMemo(targetTodo.memo)
      setCategoryId(targetTodo.categoryId)
    }
  }, [targetTodo])

  return (
    <>
      <div className="detail-page">

        <div className="detail-header">

          <Link to="/tasks">
            <button onClick={() => editCancell()}>← 戻る</button>
          </Link>

          <h1>
            {isEditMode ? "タスク編集" : "新しいタスク"}
          </h1>

          {isEditMode && targetTodo && (
            <Link to="tasks">
              <button
                onClick={() => {
                  const isDelete = window.confirm("本当に削除しますか？")

                  if (isDelete) {
                    handleDeleteTodo(targetTodo.id)
                  }
                }}
              >
                削除
              </button>
            </Link>
          )}
          
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

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {!isEditMode && (
              <option value="">
                カテゴリを選択
              </option>
            )}

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
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave()
              }
            }}
          />

          <div className="detail-actions">

            <Link to="/tasks">
              <button onClick={handleSave}>
                {isEditMode ? "更新" : "保存"}
              </button>
            </Link>

            {isEditMode && targetTodo && (
              <button
                onClick={() => handleToggleTodo(targetTodo.id)}
              >
                {targetTodo.status === "completed" ? "未完了にする" : "完了にする"}
              </button>
            )}

          </div>
        </div>

      </div>
    </>
  )
}

export default TodoDetailView