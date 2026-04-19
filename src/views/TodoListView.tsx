import  TodoItem  from '../components/TodoItem'
import type { Todo, Filter, View } from '../types'
import '../App.css'


type Props = {
  todos: Todo[]
  todoByCategory: Todo[]
  filteredTodos: Todo[]
  searchText: string
  inputText: string
  filter: Filter
  setSearchText: (text: string) => void
  setInputText: (text: string) => void
  setFilter: (filter: Filter) => void
  setView: (view: View) => void
  onAddTodo: () => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
  onToggleEdit: (id: number) => void
  onUpdate: (id: number, text: string) => void
}

function TodoListView({ todos, todoByCategory, filteredTodos, searchText, inputText, filter, setView, setSearchText, setInputText, setFilter, onAddTodo, onDelete, onToggle, onToggleEdit, onUpdate }: Props) {


  return (
    <>
      <div className="body">
        <input 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} 
          placeholder="検索..."
        />

        <p>{filteredTodos.length === 0 ? "該当なし" : filteredTodos.length + "/" + todos.length + "件"}</p>

        <input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)} 
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              onAddTodo()
            }
          }}
          placeholder="新しいタスクを入力..."
        />
        <button onClick={onAddTodo} disabled={inputText.trim() === ""}>
          追加
        </button>

        <div>
          <button 
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active-filter" : ""}>
              全て
          </button>
          <button 
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "active-filter" : ""}>
              完了
          </button>
          <button 
            onClick={() => setFilter("active")}
            className={filter === "active" ? "active-filter" : ""}>
              未完了
          </button>
        </div>

        {todoByCategory.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            searchText={searchText}
            onDelete={onDelete} 
            onToggle={onToggle} 
            onToggleEdit={onToggleEdit}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      <div>
        <button onClick={() => setView("detail")}>戻る</button>
      </div>
    </>
  )
}

export default TodoListView