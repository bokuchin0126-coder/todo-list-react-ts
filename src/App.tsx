import { useState } from 'react'
import { useEffect } from 'react'
import  TodoItem  from './TodoItem'
import type { Todo, Filter } from './types'
import './App.css'


function App() {

const [todos, setTodos] = useState<Todo[]>(() => {
  const saved = localStorage.getItem("todos")
  return saved ? JSON.parse(saved) : []
})
const [text, setText] = useState("")
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


const addTodo = () => {
  if (text.trim() === "") return

  setTodos([...todos, { id: Date.now(), text: text, status: "active", isEditing: false }])
  setText("")
}

const deleteTodo = (id: number) => {
  setTodos(prev => prev.filter(todo => todo.id !== id))
}

const toggleTodo = (id: number) => {
  setTodos(prev => prev.map(todo => 
    todo.id === id ? {...todo, status: todo.status === "active" ? "completed" : "active"} : todo
  ))
}

const filteredTodos = todos.filter(todo => {
  if (filter !== "all" && todo.status !== filter) return false

  if (!todo.text.includes(searchText)) return false

  return true
})

const toggleEdit = (id: number) => {
  setTodos(prev => prev.map(todo => 
    todo.id === id ? {...todo, isEditing: !todo.isEditing} : todo
  ))
}

const updateTodo = (id: number, newText: string) => {
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
      />

      <input 
        value={text}
        onChange={(e) => setText(e.target.value)} 
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            addTodo()
          }
        }}
      />
      <button onClick={addTodo} disabled={text.trim() === ""}>
        追加
      </button>

      <div>
        <button onClick={() => setFilter("all")}>全て</button>
        <button onClick={() => setFilter("completed")}>完了</button>
        <button onClick={() => setFilter("active")}>未完了</button>
      </div>

      {filteredTodos.map((todo) => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onDelete={deleteTodo} 
          onToggle={toggleTodo} 
          onToggleEdit={toggleEdit}
          onUpdate={updateTodo}
        />
      ))}
    </div>
  </>
)
}

export default App