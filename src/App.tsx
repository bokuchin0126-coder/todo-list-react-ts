import { useState } from 'react'
import  TodoItem  from './TodoItem'
import type { Todo, Status, Filter } from './types'
import './App.css'


function App() {

const [todos, setTodos] = useState<Todo[]>([])
const [text, setText] = useState("")
const [filter, setFilter] = useState<Filter>("all")

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
  if (filter === "all") return true
  return todo.status === filter
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
  </>
)
}

export default App