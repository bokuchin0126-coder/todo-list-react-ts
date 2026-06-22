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
    searchText,
    selectedCategoryId,
    setSearchText,
    setSelectedCategoryId,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
    handleUpdateTodo,
    changeDate
  } = todoState

  const categoryState = useCategory(setError, setLoading, errorTime)
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
        categories,
        today,
        error,
        selectedDate,
        handleDeleteTodo,
        handleEditTodo,
        handleToggleTodo,
        handleUpdateTodo,
      }}>

      <Routes>
        <Route path="/tasks/new" element={
          <TodoDetailView
            handleAddTodo={handleAddTodo}
          />
        } />

        <Route path="/tasks/:id" element={
          <TodoDetailView
            handleAddTodo={handleAddTodo}
          />
        } />
  
        <Route path="/list" element={
          <div className="CategoryList">
            <TodoListView
              filteredTodos={filteredTodos}
              searchText={searchText}
              selectedCategoryId={selectedCategoryId}
              filter={filter}
              setSearchText={setSearchText}
              setFilter={setFilter}
              handleChangeDate={changeDate}
            />
          </div>
        } />

        <Route path="/stats" element={
          <TodoStatsView />
        } />
      </Routes>
    </TodoContext.Provider>
    </>
  )
}

export default App