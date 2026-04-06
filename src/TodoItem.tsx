import type { Todo } from "./types"

type Props = {
    todo: Todo
    onDelete: (id: number) => void
    onToggle: (id: number) => void
    onToggleEdit: (id: number) => void
    onUpdate: (id: number, text: string) => void
}



function TodoItem({ todo, onDelete, onToggle, onToggleEdit, onUpdate }: Props) {
    return (
        <div>
            {todo.isEditing ? (
                <input
                  value={todo.text}
                  onChange={(e) => onUpdate(todo.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onToggleEdit(todo.id)
                    }
                  }}
                  />
            ) : (
                <span>{todo.text}</span>
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