import { useState } from 'react'
import { useEffect } from 'react'
import  TodoItem  from './components/TodoItem'
import type { Todo, Filter } from './types'
import './App.css'


function App() {

const [todos, setTodos] = useState<Todo[]>(() => {
  const saved = localStorage.getItem("todos")
  return saved ? JSON.parse(saved) : []
})
const [inputText, setInputText] = useState("")
const [searchText, setSearchText] = useState("")
const [filter, setFilter] = useState<Filter>(() => {
  const saved = localStorage.getItem("filter")
  return (saved as Filter) || "all"
})

useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(todos))
}, [todos])

useEffect(() => {
  localStorage.setItem("filter", filter)
}, [filter])


const handleAddTodo = () => {
  if (inputText.trim() === "") return

  setTodos([...todos, { id: Date.now(), text: inputText, status: "active", isEditing: false }])
  setInputText("")
}

const handleDeleteTodo = (id: number) => {
  setTodos(prev => prev.filter(todo => todo.id !== id))
}

const handleToggleTodo = (id: number) => {
  setTodos(prev => prev.map(todo => 
    todo.id === id ? {...todo, status: todo.status === "active" ? "completed" : "active"} : todo
  ))
}

function filterByStatus(todos: Todo[], filter: Filter) {
  if (filter === "all") return todos
  return todos.filter(todo => todo.status === filter)
}

function filterBySearch(todos: Todo[], searchText: string) {
  return todos.filter(todo => todo.text.includes(searchText))
}

const filteredTodos = filterBySearch(
  filterByStatus(todos, filter),
  searchText
)

const handleToggleEdit = (id: number) => {
  setTodos(prev => prev.map(todo => 
    todo.id === id ? {...todo, isEditing: !todo.isEditing} : todo
  ))
}

const handleUpdateTodo = (id: number, newText: string) => {
  setTodos(prev => prev.map(todo => 
    todo.id === id ? {...todo, text: newText } : todo
  ))
}


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

      {filteredTodos.map((todo) => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          searchText={searchText}
          onDelete={handleDeleteTodo} 
          onToggle={handleToggleTodo} 
          onToggleEdit={handleToggleEdit}
          onUpdate={handleUpdateTodo}
        />
      ))}
    </div>
  </>
)
}

export default App