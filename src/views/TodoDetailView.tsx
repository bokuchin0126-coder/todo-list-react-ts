import { Link, useNavigate, useParams } from "react-router-dom" 
import type { Category } from "../components/types"
import { TodoContext } from "../context/TodoContext"
import { useContext, useState, useEffect } from "react"
import "../css/todo-detail.css" 

type Props = {
  handleAddTodo: (text: string, memo: string, categoryId: number) => void
  handleUpdateCategoryTodo: (id: number, categoryId: number) => void
}

function TodoDetailView({ handleAddTodo, handleUpdateCategoryTodo }: Props) {

  const todoContext = useContext(TodoContext)
  if (!todoContext) return null
  
  const { todos, categories, handleDeleteTodo, handleToggleTodo, handleUpdateTextTodo,
     handleEditTodo, handleUpdateMemoTodo } = todoContext

  const navigate = useNavigate()
  const { id } = useParams()
  const isDetailMode = id !== undefined

  const [title, setTitle] = useState<string>("")
  const [memo, setMemo] = useState<string>("")
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const [categoryId, setCategoryId] = useState<number>(0)
  const targetTodo = todos.find(todo => todo.id === Number(id)) 
  const isReadOnly = isDetailMode && !isEditMode

  const selectedCategory = categories.find((c) => 
    c.id === (isDetailMode ? targetTodo?.categoryId : categoryId)
  )


  const handleSave = () => {
    if (categoryId === 0) {
      alert("カテゴリを選択してください")
      return
    }
    else if (isDetailMode && isEditMode && targetTodo) {
      handleUpdateTextTodo(targetTodo.id, title)
      handleUpdateMemoTodo(targetTodo.id, memo)
      handleEditTodo(targetTodo.id)
      setIsEditMode(false)
    }
    else if (isDetailMode && !isEditMode && targetTodo) {
      setIsEditMode(true)
    }
    else {
      handleAddTodo(title, memo, categoryId)
      if (title === "") return
      
      setTitle("")
      navigate("/tasks")
    }
    
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
            <button
              onClick={() => editCancell()}
              disabled={isEditMode}
            >
              ← 戻る
            </button>
          </Link>

          <h1>
            {isDetailMode ? "タスク詳細" : "新しいタスク"}
          </h1>

          {isDetailMode && targetTodo && (
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
          
          <p>
            {targetTodo && 
              targetTodo.status === "completed" ? "☑" : "□"
            }
          </p>

          <input
            className="detail-title"
            placeholder="タスク名"
            value={title}
            readOnly={isReadOnly}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave()
              }
            }}
          />

          <select
            className={`category-tag ${selectedCategory?.color}`}
            value={isDetailMode ? targetTodo?.categoryId : categoryId}
            disabled={isReadOnly}
            onChange={(e) => {
              const value = Number(e.target.value)

              if (isDetailMode && targetTodo) {
                handleUpdateCategoryTodo(targetTodo.id, value)
              } else {
                setCategoryId(value)
              }
            }}
          >
            {!isDetailMode && (
              <option value="">
                 カテゴリを選択
              </option>
            )}

            {categories.map(category => (
              <option
                className={`category-tag ${category.color}`}
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
           
          </select>

          {isDetailMode && targetTodo &&

            <div>
             <p>作成時間: {new Date(targetTodo.createdAt).toLocaleString("ja-JP")}</p>
             <p>更新時間: {new Date(targetTodo.updatedAt).toLocaleString("ja-JP")}</p>
           </div>

          }

          <textarea
            className="detail-memo"
            placeholder="メモを入力"
            readOnly={isReadOnly}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />

          <div className="detail-actions">

            {isDetailMode ? 
              <button onClick={handleSave}>
                {isEditMode ? "更新" : "編集"}
              </button>
            :
                <button onClick={handleSave}>
                  保存
                </button>
            }

            {isDetailMode && isEditMode && targetTodo && (
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