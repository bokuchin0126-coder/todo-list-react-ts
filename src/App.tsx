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

  const todoState = useTodo(setError, setLoading)
  const {
    dailyTodos,
    selectedDate,
    today,
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
    setCategories,
    categoryName,
    setCategoryName,
    handleAddCategory,
    handleEditCategory,
    handleKeepCategory
  } = categoryState

  const localStrage = useInitializeApp(dailyTodos, categories, filter, selectedCategoryId, 
    setDailyTodos, setError, setLoading, selectedDate, setCategories)

  const filteredTodos = currentTodos.filter(todo => {
    const matchFilter = filter === "all" || todo.status === filter

    const matchSearch = todo.text.includes(searchText)

    return matchFilter && matchSearch
  })
  

  const todoByCategory = filteredTodos.filter(todo => todo.categoryId === selectedCategoryId)

  useEffect(() => {
    async function test() {
      const { data, error } =
      await supabase
       .from("todos")
       .select("*")
       
      console.log(data)
      console.log(error)
    }
    test()
  }, [])


  return (
    <>
    <TodoContext.Provider
      value={{
        dailyTodos,
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
              error={error}
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