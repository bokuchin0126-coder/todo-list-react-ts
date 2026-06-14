import { useState, useEffect } from 'react'
import { supabase } from "./lib/supabase"
import { Routes, Route } from "react-router-dom" 
import  TodoListView  from './views/TodoListView'
import  TodoDetailView  from './views/TodoDetailView'
import  TodoStatsView from './views/TodoStatsView'
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

  const errorTime = () => {
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  const todoState = useTodo(setError, setLoading, errorTime)
  const {
    todos,
    selectedDate,
    today,
    setTodos,
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

  const categoryState = useCategory(setError, setLoading, selectedDate, errorTime)
  const {
    categories,
    setCategories,
    categoryName,
    setCategoryName,
    handleAddCategory,
    handleEditCategory,
    handleKeepCategory
  } = categoryState

  const localStrage = useInitializeApp(setTodos, setCategories, filter, selectedCategoryId, 
    setError, setLoading, selectedDate, today, errorTime)

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
        todos,
        error,
        selectedDate,
        handleDeleteTodo,
        handleToggleEdit,
        handleToggleTodo,
        handleUpdateTodo,
      }}>

      <Routes>
        <Route path="/" element={
          <TodoDetailView
            inputText={inputText}
            categories={categories}
            categoryName={categoryName}
            setSelectedCategoryId={setSelectedCategoryId}
            setCategoryName={setCategoryName}
            handleAddCategory={handleAddCategory}
            handleChangeDate={changeDate}
            handleEditCategory={handleEditCategory}
            handleKeepCategory={handleKeepCategory}
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
              loading={loading}
              setSearchText={setSearchText}
              setInputText={setInputText}
              setFilter={setFilter}
              handleAddTodo={handleAddTodo}
            />
          </div>
        } />

        <Route path="/stats" element={
          <TodoStatsView
            today={today}
          />
        } />
      </Routes>
    </TodoContext.Provider>
    </>
  )
}

export default App