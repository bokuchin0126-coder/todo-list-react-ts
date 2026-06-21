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
  
  const { categories, handleDeleteTodo, handleToggleTodo, handleUpdateTodo, handleToggleEdit } = todoContext

  const [tempText, setTempText] = useState<string>(todo.text)
  const divRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

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
          handleToggleEdit(todo.id)
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
                          handleToggleEdit(todo.id)
                      }
                      if (e.key === "Enter") {
                          if (tempText.trim() === "") return
                          handleUpdateTodo(todo.id, tempText)
                          handleToggleEdit(todo.id)
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
              {categories.map(category => (
              <p>
                {category.name}
              </p>
            ))}
            </div>

            <div className="status-cell">

                {todo.status === "completed"
                  ? "完了"
                  : "アクティブ"}

            </div>

            <div className="time-cell">
                {todo.createdAt}
            </div>

            <div className="action-cell">

              <Link to={`/detail/${todo.id}`}>
                <button 
                  className="edit-button"
                  onClick={() => {
                    if (todo.isEditing) {
                      handleUpdateTodo(todo.id, tempText),
                      setTempText(todo.text)
                    }

                    handleToggleEdit(todo.id)
                  }}
                >
                  編集
                </button>
              </Link>

              <button
                className="delete-button"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                削除
              </button>

            </div>

        </div>
    )
}

export default TodoItem