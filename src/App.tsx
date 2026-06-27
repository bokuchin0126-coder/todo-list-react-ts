import { useState, useEffect } from 'react'
import { supabase } from "./lib/supabase"
import { Routes, Route, Navigate } from "react-router-dom" 
import  TodoListView  from './views/TodoListView'
import  TodoDetailView  from './views/TodoDetailView'
import  TodoStatsView from './views/TodoStatsView'
import TodoCategoryView from "./views/TodoCategoryView"
import Layout from "./views/Layout"
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
  const [loading, setLoading] = useState<boolean>(false)


  const todoState = useTodo(setLoading)
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
    handleUpdateTextTodo,
    handleUpdateMemoTodo,
    handleUpdateCategoryTodo,
    changeDate
  } = todoState

  const categoryState = useCategory(setLoading)
  const {
    categories,
    setCategories,
    categoryName,
    setCategoryName,
    handleAddCategory,
    handleEditCategory,
    handleKeepTextCategory,
    handleKeepColorCategory,
    handleDeleteCategory
  } = categoryState

  const localStrage = useInitializeApp(setTodos, setCategories, filter, selectedCategoryId, setLoading)

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
        selectedDate,
        handleDeleteTodo,
        handleEditTodo,
        handleToggleTodo,
        handleUpdateTextTodo,
        handleUpdateMemoTodo
      }}>

      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />

        <Route element={<Layout />}>

          <Route path="/tasks/new" element={
            <TodoDetailView
              handleAddTodo={handleAddTodo}
              handleUpdateCategoryTodo={handleUpdateCategoryTodo}
            />
          } />

          <Route path="/tasks/:id" element={
            <TodoDetailView
              handleAddTodo={handleAddTodo}
              handleUpdateCategoryTodo={handleUpdateCategoryTodo}
            />
          } />
  
          <Route path="/tasks" element={
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
  
          <Route path="/tasks/stats" element={
            <TodoStatsView />
          } />
  
          <Route path="/tasks/categories" element={
            <TodoCategoryView 
              categoryName={categoryName}
              setCategoryName={setCategoryName}
              handleAddCategory={handleAddCategory}
              handleEditCategory={handleEditCategory}
              handleKeepTextCategory={handleKeepTextCategory}
              handleKeepColorCategory={handleKeepColorCategory}
              handleDeleteCategory={handleDeleteCategory}
            />
          } />
  
        </Route>

      </Routes>

    </TodoContext.Provider>
    </>
  )
}

export default App