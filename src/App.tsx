import { useState } from 'react'
import { useEffect } from 'react'
import  TodoListView  from './views/TodoListView'
import  TodoDetailView  from './views/TodoDetailView'
import useTodo from './hooks/useTodos'
import useCategory from './hooks/useCategories'
import useInitializeApp from './hooks/useInitializeApp'
import type { Todo, Filter, View } from './components/types'
import './App.css'


function App() {
  
  const [view, setView] = useState<View>("detail")
  const [filter, setFilter] = useState<Filter>(() => {
    const saved = localStorage.getItem("filter")
    return (saved as Filter) || "all"
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const todoState = useTodo(filter, setError, setLoading)
  const {
    todos,
    setTodos,
    inputText,
    searchText,
    selectedCategoryId,
    setInputText,
    setSearchText,
    setSelectedCategoryId,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleToggleEdit,
    handleUpdateTodo
  } = todoState

  const categoryState = useCategory(setTodos, setError, setLoading)
  const {
    categories,
    categoryName,
    setCategoryName,
    handleAddCategory,
    handleDeleteCategory
  } = categoryState

  const localStrage = useInitializeApp(todos, categories, filter, selectedCategoryId, setTodos, setError, setLoading)

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


  return (
    <>
      {view === "detail" ? (
        <TodoDetailView
            categories={categories}
            todos={todos}
            categoryName={categoryName}
            setView={setView}
            setSelectedCategoryId={setSelectedCategoryId}
            setCategoryName={setCategoryName}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        ) : (
          <div className="CategoryList">
          <TodoListView
            todos={todos} 
            todoByCategory={todoByCategory}
            selectedCategoryId={selectedCategoryId}
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