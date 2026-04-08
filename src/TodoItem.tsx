import type { Todo } from "./types"
import { useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"

type Props = {
    todo: Todo
    onDelete: (id: number) => void
    onToggle: (id: number) => void
    onToggleEdit: (id: number) => void
    onUpdate: (id: number, text: string) => void
}


function TodoItem({ todo, onDelete, onToggle, onToggleEdit, onUpdate }: Props) {
  const [tempText, setTempText] = useState<string>(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
  if (todo.isEditing) {
    inputRef.current?.focus()
  }
  }, [todo.isEditing])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
          setTempText(todo.text)
          onToggleEdit(todo.id)
        }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
        document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

    return (
        <div>
            {todo.isEditing ? (
                <input
                ref={inputRef}
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setTempText(todo.text)
                        onToggleEdit(todo.id)
                    }
                    if (e.key === "Enter") {
                        if (tempText.trim() === "") return
                        onUpdate(todo.id, tempText)
                        onToggleEdit(todo.id)
                    }
                  }}
                  />
            ) : (
                <span className={todo.status === "completed" ? "completed" : ""}>
                    {todo.text}
                </span>
            )}

            <button onClick={() => onToggle(todo.id)}>
                {todo.status === "active" ? "完了" : "未完了"}
            </button>

            <button onClick={() => onToggleEdit(todo.id)}>
                {todo.isEditing ? "保存" : "編集"}
            </button>

            

            <button onClick={() => onDelete(todo.id)}>
                消去
            </button>
        </div>
    )
}

export default TodoItem