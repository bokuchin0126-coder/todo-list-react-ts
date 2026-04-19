import { useState } from 'react'
import { useEffect } from 'react'
import  TodoListView  from './views/TodoListView'
import  TodoDetailView  from './views/TodoDetailView'
import type { Todo, Filter, View } from './types'
import './App.css'


function App() {

  const [view, setView] = useState<View>("detail")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos")
    return saved ? JSON.parse(saved) : []
  })
  const [inputText, setInputText] = useState<string>("")
  const [searchText, setSearchText] = useState<string>("")
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
      {view === "list" ? (
        <div className="CategoryList">
          <TodoListView
            todos={todos} 
            filteredTodos={filteredTodos}
            searchText={searchText}
            inputText={inputText}
            filter={filter}
            setSearchText={setSearchText}
            setInputText={setInputText}
            setFilter={setFilter}
            onAddTodo={handleAddTodo}
            onDelete={handleDeleteTodo} 
            onToggle={handleToggleTodo} 
            onToggleEdit={handleToggleEdit}
            onUpdate={handleUpdateTodo}
          />
        </div>
        ) : (
          <TodoDetailView
            view={view}
            setView={setView}
            categoryId={selectedCategoryId} 

          />
        )}
    </>
  )
}

export default App