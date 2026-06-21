import type { Todo } from "./types"
import { useState, useEffect, useRef, useContext } from "react"
import { TodoContext } from "../context/TodoContext"

type Props = {
    todo: Todo
    searchText: string
}


function TodoItem({ todo, searchText,  }: Props) {

  const todoContext = useContext(TodoContext)
  if (!todoContext) return null
  
  const { handleDeleteTodo, handleToggleTodo, handleUpdateTodo, handleToggleEdit } = todoContext

  const [tempText, setTempText] = useState<string>(todo.text)
  const divRef = useRef<HTMLDivElement>(null)

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
            
            <div className="left">
              <button onClick={() => handleToggleTodo(todo.id)}>
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
                  <span className={todo.status === "completed" ? "completed" : ""}>
                      {searchText ? todo.text.split(searchText).map((part, i, arr) => (
                          <span key={i}>
                              {part}
                              {i < arr.length - 1 && <mark>{searchText}</mark>}
                          </span>
                      )) : todo.text}
                  </span>
              )}
            </div>

            <div className="right">
              <button onClick={() => {
                if (todo.isEditing) {
                handleUpdateTodo(todo.id, tempText),
                setTempText(todo.text)
              }
              handleToggleEdit(todo.id)}}>
                  {todo.isEditing ? "保存" : "編集"}
              </button>

              <button onClick={() => handleDeleteTodo(todo.id)}>
                  消去
              </button>
            </div>
        </div>
    )
}

export default TodoItem