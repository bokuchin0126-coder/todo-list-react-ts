import { useState } from 'react'
import  TodoListView  from './views/TodoListView'
import  TodoDetailView  from './views/TodoDetailView'
import useTodo from './hooks/useTodos'
import useCategory from './hooks/useCategories'
import useInitializeApp from './hooks/useInitializeApp'
import type { Filter, View } from './components/types'
import './App.css'


function App() {
  
  const [view, setView] = useState<View>("detail")
  const [filter, setFilter] = useState<Filter>(() => {
    const saved = localStorage.getItem("filter")
    return (saved as Filter) || "all"
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const todoState = useTodo(setError, setLoading)
  const {
    dailyTodos,
    today,
    setDailyTodos,
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

  const categoryState = useCategory(setDailyTodos, setError, setLoading, today)
  const {
    categories,
    categoryName,
    setCategoryName,
    handleAddCategory,
    handleDeleteCategory
  } = categoryState

  const localStrage = useInitializeApp(dailyTodos, categories, filter, selectedCategoryId, setDailyTodos, setError, setLoading, today)

  const filteredTodos = dailyTodos.map(day => {
    if (day.date !== today) {
      return day
    }
    return {
      ...day,
      todos: day.todos.filter(todo => {
        const matchFilter = filter === "all" || todo.status === filter

        const matchSearch = todo.text.includes(searchText)

        return matchFilter && matchSearch
      })
    }
  })
  

  const todoByCategory = filteredTodos.map(day => {
    if (day.date !== today) {
          return day
        }
        return {
          ...day,
          todos: day.todos.filter(todo => todo.categoryId === selectedCategoryId)
        }
      })


  return (
    <>
      {view === "detail" ? (
        <TodoDetailView
            categories={categories}
            dailyTodos={dailyTodos}
            today={today}
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
            dailyTodos={dailyTodos}
            todoByCategory={todoByCategory}
            today={today}
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