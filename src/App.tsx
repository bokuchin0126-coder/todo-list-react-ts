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
    selectedDate,
    setDailyTodos,
    currentTodos,
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
    handleUpdateTodo,
    changeDate
  } = todoState

  const categoryState = useCategory(setDailyTodos, setError, setLoading, selectedDate)
  const {
    categories,
    categoryName,
    setCategoryName,
    handleAddCategory,
    handleDeleteCategory
  } = categoryState

  const localStrage = useInitializeApp(dailyTodos, categories, filter, selectedCategoryId, setDailyTodos, setError, setLoading,selectedDate)

  const filteredTodos = currentTodos.filter(todo => {
    const matchFilter = filter === "all" || todo.status === filter

    const matchSearch = todo.text.includes(searchText)

    return matchFilter && matchSearch
  })
  

  const todoByCategory = filteredTodos.filter(todo => todo.categoryId === selectedCategoryId)


  return (
    <>
      {view === "detail" ? (
        <TodoDetailView
            categories={categories}
            dailyTodos={dailyTodos}
            selectedDate={selectedDate}
            categoryName={categoryName}
            setView={setView}
            setSelectedCategoryId={setSelectedCategoryId}
            setCategoryName={setCategoryName}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onChangeDate={changeDate}
          />
        ) : (
          <div className="CategoryList">
          <TodoListView
            dailyTodos={dailyTodos}
            todoByCategory={todoByCategory}
            selectedDate={selectedDate}
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