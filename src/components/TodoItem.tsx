import type { Todo } from "./types"
import { Link, useNavigate } from "react-router-dom" 
import { useState, useEffect, useRef, useContext } from "react"
import { TodoContext } from "../context/TodoContext"
import "../css/todo-item.css"

type Props = {
    todo: Todo
    searchText: string
}


function TodoItem({ todo, searchText }: Props) {

  const todoContext = useContext(TodoContext)
  if (!todoContext) return null
  
  const { categories, handleDeleteTodo, handleToggleTodo, handleUpdateTextTodo, handleEditTodo } = todoContext

  const [tempText, setTempText] = useState<string>(todo.text)
  const divRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const category = categories.find(category => category.id === todo.categoryId)

  useEffect(() => {
  if (todo.isEditing) {
    divRef.current?.focus()
  }
  }, [todo.isEditing])

  useEffect(() => {
    if (!todo.isEditing) return

    const handleClickOutside = (e: MouseEvent) => {
        if (divRef.current && !divRef.current.contains(e.target as Node)) {
          setTempText(todo.text)
          handleEditTodo(todo.id)
        }
    }
    document.addEventListener("click", handleClickOutside)

    return () => {
        document.removeEventListener("click", handleClickOutside)
    }
  }, [todo.isEditing])
  
    return (
        <div className="todo-item" ref={divRef}>
            
            <div className="task-cell">

              <button
                className="check-button" 
                onClick={() => handleToggleTodo(todo.id)}
              >
                {todo.status === "active" ? "□" : "✓"}
              </button>

              <span 
                className=
                  {todo.status === "completed"
                    ? "completed" 
                    : ""}
              >
                {searchText ? todo.text.split(searchText).map((part, i, arr) => (

                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <mark>{searchText}</mark>}
                  </span>

                )) : todo.text}
              </span>

            </div>

            <div className="category-cell">

              <p className={`category-tag ${category?.color ?? "gray"}`}>
                {category ? category.name : "未分類"}
              </p>

            </div>

            <div className="status-cell">

                {todo.status === "completed"
                  ? "完了"
                  : "アクティブ"}

            </div>

            <div className="time-cell">
                {new Date(todo.createdAt).toLocaleString("ja-JP")}
            </div>

            <div className="action-cell">

              <Link to={`/tasks/${todo.id}`}>
                <button 
                  className="edit-button"
                  onClick={() => {
                    handleEditTodo(todo.id)
                  }}
                >
                  詳細
                </button>
              </Link>

              <button
                className="delete-button"
                onClick={() => {
                  const isDelete = window.confirm("本当に削除しますか？")

                  if (isDelete) {
                    handleDeleteTodo(todo.id)
                  }
                }}
              >
                削除
              </button>

            </div>

        </div>
    )
}

export default TodoItem