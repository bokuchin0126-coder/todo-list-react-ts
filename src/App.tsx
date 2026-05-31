import { useState } from 'react'
import { Routes, Route } from "react-router-dom" 
import  TodoListView  from './views/TodoListView'
import  TodoDetailView  from './views/TodoDetailView'
import useTodo from './hooks/useTodos'
import useCategory from './hooks/useCategories'
import useInitializeApp from './hooks/useInitializeApp'
import { TodoContext } from "./context/TodoContext"
import type { Filter } from './components/types'
import './App.css'


function App() {
  
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
    dailyCategories,
    categoryName,
    currentCategories,
    setCategoryName,
    handleAddCategory,
    handleDeleteCategory
  } = categoryState

  const localStrage = useInitializeApp(dailyTodos, dailyCategories, filter, selectedCategoryId, setDailyTodos, setError, setLoading,selectedDate)

  const filteredTodos = currentTodos.filter(todo => {
    const matchFilter = filter === "all" || todo.status === filter

    const matchSearch = todo.text.includes(searchText)

    return matchFilter && matchSearch
  })
  

  const todoByCategory = filteredTodos.filter(todo => todo.categoryId === selectedCategoryId)


  return (
    <>
    <TodoContext.Provider
      value={{
        dailyTodos,
        selectedDate,
        handleDeleteTodo,
        handleToggleEdit,
        handleToggleTodo,
        handleUpdateTodo
      }}>

      <Routes>
        <Route path="/" element={
          <TodoDetailView
            dailyCategories={dailyCategories}
            categoryName={categoryName}
            setSelectedCategoryId={setSelectedCategoryId}
            currentCategories={currentCategories}
            setCategoryName={setCategoryName}
            handleAddCategory={handleAddCategory}
            handleDeleteCategory={handleDeleteCategory}
            handleChangeDate={changeDate}
          />
        } />
  
        <Route path="/list" element={
          <div className="CategoryList">
            <TodoListView
              todoByCategory={todoByCategory}
              searchText={searchText}
              inputText={inputText}
              selectedCategoryId={selectedCategoryId}
              filter={filter}
              error={error}
              loading={loading}
              setSearchText={setSearchText}
              setInputText={setInputText}
              setFilter={setFilter}
              handleAddTodo={handleAddTodo}
            />
          </div>
        } />
      </Routes>
    </TodoContext.Provider>
    </>
  )
}

export default App