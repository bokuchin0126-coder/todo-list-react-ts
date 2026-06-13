import  TodoItem  from '../components/TodoItem'
import type { Filter, Todo } from '../components/types'
import { Link } from "react-router-dom" 
import { TodoContext } from "../context/TodoContext"
import { useContext } from "react" 
import '../App.css'


type Props = {
  todoByCategory: Todo[]
  selectedCategoryId: number | null
  searchText: string
  inputText: string
  filter: Filter
  loading: boolean
  setSearchText: (text: string) => void
  setInputText: (text: string) => void
  setFilter: (filter: Filter) => void
  handleAddTodo: () => void
}

function TodoListView({ todoByCategory, selectedCategoryId, searchText, inputText, filter, loading, setSearchText, 
  setInputText, setFilter, handleAddTodo}: Props) {

    const todoContext = useContext(TodoContext)
    if (!todoContext) return null

    const { todos, error } = todoContext

  const todosInCategory = todos.map(todo => todo.categoryId === selectedCategoryId)

  return (
    <>
      <div className="body">
        <input 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} 
          placeholder="検索..."
        />

        <p>{todoByCategory.length === 0 ? "該当なし" : todoByCategory.length + "/" + todosInCategory.length + "件"}</p>

        <input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)} 
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              handleAddTodo()
            }
          }}
          placeholder="新しいタスクを入力..."
        />
        
        <button onClick={handleAddTodo} disabled={inputText.trim() === ""}>
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
        {loading && <p>ローディング中...</p>}
        {error && <p>{error}</p>}

        {todoByCategory.map(todo => 
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            searchText={searchText}
          />
        )}
        
      </div>

      <Link to="/" >
        <button>戻る</button>
      </Link>
    </>
  )
}

export default TodoListView