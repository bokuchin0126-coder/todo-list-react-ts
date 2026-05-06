import { useState } from 'react'
import { useEffect } from 'react'
import  TodoListView  from './views/TodoListView'
import  TodoDetailView  from './views/TodoDetailView'
import type { Todo, Filter, View, Category, ApiTodo } from './types'
import './App.css'


function App() {
  
  const [view, setView] = useState<View>("detail")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputText, setInputText] = useState<string>("")
  const [searchText, setSearchText] = useState<string>("")
  const [filter, setFilter] = useState<Filter>(() => {
    const saved = localStorage.getItem("filter")
    return (saved as Filter) || "all"
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("todos")
    if (saved) {
      setTodos(JSON.parse(saved))
      setLoading(false)
      return
    }

    setLoading(true)
    const fetchDate = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
        const date = await res.json()

        const converted = date.map((item: ApiTodo) => ({
          id: item.id,
          text: item.title,
          status: item.completed ? "completed" : "active",
          categoryId: 1
        }))
          setTodos(converted)
      } catch (e) { 
        setError("データの取得に失敗しました")
      } finally {
        setLoading(false)
        setError(null)
      }
    }

    fetchDate()
  }, [])

  useEffect(() => {
    if (todos.length === 0) return
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem("filter", filter)
  }, [filter])

  const handleAddTodo = async () => {
    if (!inputText.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: inputText,
          completed: false
        })
      })
      const date = await res.json()

      const newTodo: Todo = {
        id: Date.now(),
        text: date.title,
        status: "active",
        isEditing: false,
        categoryId: 1
      }

      setTodos(prev => [...prev, newTodo])
      setInputText("")
    } catch (e) {
      setError("データの追加に失敗しました")
    } finally {
      setLoading(false)
      setError(null)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    setLoading(true)
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "DELETE"
      })
      setTodos(prev => prev.filter(todo => todo.id !== id)) 
    } catch (e) {
      setError("データの消去に失敗しました")
    } finally {
      setLoading(false)
      setError(null)
    }
  }

  const handleToggleTodo = async (id: number) => {
    setLoading(true)
    try {
      const target = todos.find(t => t.id ===id)
      if (!target) return 

      const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: target.status !== "completed" 
        })
      })
      const date = await res.json()

      setTodos(prev => prev.map(t => (
        t.id === id ? {...t, status: t.status === "completed" ? "active" : "completed"} : t
      )))

    } catch (e) {
      setError("データの更新に失敗しました")
    } finally {
      setLoading(false)
      setError(null)
    }
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

  const todoByCategory = filteredTodos.filter(
    (todo) => todo.categoryId === selectedCategoryId
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
      {view === "detail" ? (
        <TodoDetailView
            view={view}
            todos={todos}
            setView={setView}
            selectedCategoryId={selectedCategoryId} 
            setSelectedCategoryId={setSelectedCategoryId}
          />
        ) : (
          <div className="CategoryList">
          <TodoListView
            todos={todos} 
            todoByCategory={todoByCategory}
            selectedCategoryId={selectedCategoryId}
            filteredTodos={filteredTodos}
            searchText={searchText}
            inputText={inputText}
            filter={filter}
            error={error}
            loading={loading}
            setSearchText={setSearchText}
            setInputText={setInputText}
            setFilter={setFilter}
            setView={setView}
            onAddTodo={handleAddTodo}
            onDelete={handleDeleteTodo} 
            onToggle={handleToggleTodo} 
            onToggleEdit={handleToggleEdit}
            onUpdate={handleUpdateTodo}
          />
        </div>
        )}
        
    </>
  )
}

export default App