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

  const categoryName = categories.find(category => category.id === todo.categoryId)

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
              
              {todo.isEditing ? (

                  <input
                    value={tempText}
                    autoFocus
                    onChange={(e) => setTempText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                          setTempText(todo.text)
                          handleEditTodo(todo.id)
                      }
                      if (e.key === "Enter") {
                          if (tempText.trim() === "") return
                          handleUpdateTextTodo(todo.id, tempText)
                          handleEditTodo(todo.id)
                          setTempText(todo.text)
                      }
                    }}
                  />

              ) : (

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
              )}

            </div>

            <div className="category-cell">

              <p>{categoryName?.name}</p>

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
                    if (todo.isEditing) {
                      handleUpdateTextTodo(todo.id, tempText),
                      setTempText(todo.text)
                    }

                    handleEditTodo(todo.id)
                  }}
                >
                  編集
                </button>
              </Link>

              <Link to="/tasts">
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
              </Link>

            </div>

        </div>
    )
}

export default TodoItem