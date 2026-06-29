import { Link, useNavigate, useParams } from "react-router-dom" 
import { TodoContext } from "../context/TodoContext"
import { useContext, useState, useEffect } from "react"
import "../css/todo-detail.css" 
import "../css/todo-category.css" 


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

          <Link
            className="detail-back"
            to="/tasks"
            onClick={() => editCancell()}
          >
            ← 戻る
          </Link>

          <h1 className="detail-heading">
            {isDetailMode ? "タスク詳細" : "新しいタスク"}
          </h1>

          {isDetailMode && targetTodo ? (
            <button
              className="detail-delete"
              onClick={() => {
                if (window.confirm("本当に削除しますか？")) {
                  handleDeleteTodo(targetTodo.id)
                  navigate("/tasks")
                }
              }}
            >
              削除
            </button>
          ) : (
            <div style={{ width: 90 }} />
          )}
        </div>

        <div className="detail-card">
          
          <div className="detail-top">

            <div className="detail-title-area">

              <p className="detail-status">
                {targetTodo?.status === "completed" ? "☑" : "□"}
              </p>

              <input
                className="detail-title"
                placeholder="タスク名"
                value={title}
                readOnly={isReadOnly}
                onChange={(e)=>setTitle(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.key==="Enter"){
                    handleSave()
                  }
                }}
              />
 
            </div>
  
            <select
              className={`detail-category ${selectedCategory?.color}`}
              value={isDetailMode ? targetTodo?.categoryId : categoryId}
              disabled={isReadOnly}
              onChange={(e)=>{
                const value=Number(e.target.value)
 
                if(isDetailMode && targetTodo){
                  handleUpdateCategoryTodo(targetTodo.id,value)
                }else{
                  setCategoryId(value)
                }
              }}
            >

              {!isDetailMode && (
                <option value="" className="detail-category-placeholder">
                  カテゴリを選択
                </option>
              )}

              {categories.map(category=>(
                <option
                  className={`detail-category ${category.color}`}
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
 
            </select>
 
          </div>
 
          {isDetailMode && targetTodo &&

            <div className="detail-info">

              <div className="detail-info-card">

                <span className="detail-info-label">
                  📅 作成日時
                </span>

                <strong>
                  {new Date(targetTodo.createdAt).toLocaleString(
                  "ja-JP",
                  {
                    year:"numeric",
                    month:"2-digit",
                    day:"2-digit",
                    hour:"2-digit",
                    minute:"2-digit"
                  }
                  )}
                </strong>
              </div>
 
              <div className="detail-info-card">
 
                <span className="detail-info-label">
                  🕒 更新日時
                </span>
        
                <strong>
                  {new Date(targetTodo.updatedAt).toLocaleString(
                  "ja-JP",
                  {
                    year:"numeric",
                    month:"2-digit",
                    day:"2-digit",
                    hour:"2-digit",
                    minute:"2-digit"
                  }
                  )}
                </strong>

              </div>
            </div>
          }

          <div className="detail-memo-area">


            <textarea
              className="detail-memo"
              placeholder="メモを入力"
              readOnly={isReadOnly}
              value={memo}
              onChange={(e)=>setMemo(e.target.value)}
            />
      
          </div>

          <div className="detail-actions">

            <button
              className={`detail-save ${isEditMode ? "editing" : ""}`}
              onClick={handleSave}
            >
              {isDetailMode
              ? isEditMode
              ? "更新"
              : "編集"
              : "保存"}
            </button>

            {isDetailMode && isEditMode && targetTodo && (

              <button
                className="detail-status-button"
                onClick={() => handleToggleTodo(targetTodo.id)}
              >
                {targetTodo.status === "completed"
                ? "未完了にする"
                : "完了にする"}
              </button>

            )}

          </div>
        </div>

      </div>
    </>
  )
}

export default TodoDetailView