import { TodoContext } from "../context/TodoContext"
import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom" 
import type { Category } from '../components/types'
import '../css/todo-category.css'


type Props = {
  categoryName: string
  setCategoryName: (string: string) => void
  handleAddCategory: () => void
  handleEditCategory: (id: number) => void
  handleKeepCategory: (id: number, text: string) => void
}

function TodoCategoryView({ categoryName, setCategoryName, handleAddCategory, handleEditCategory, handleKeepCategory }: Props) {

  const todoContext = useContext(TodoContext)
    if (!todoContext) return null

  const { categories } = todoContext

  const [editText, setEditText] = useState<string>("")

  const textCopy = (name: string) => {
    const isEditing = categories.filter(category => category.isEditing)
    if (isEditing.length > 0) return

    else setEditText(name)
  }

  return (
    <>
      <div className="category-page">

        <h1>カテゴリ管理</h1>

        <div className="category-add">

          <input
            value={categoryName}
            placeholder="カテゴリ名"
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddCategory()
              }
            }}
          />

          <button onClick={handleAddCategory}>
            追加
          </button>

          {categories.length === 0 && (
            <p>カテゴリがありません</p>
          )}

        </div>

        <div className="category-list">

          {categories.map(category => (

            <div
              key={category.id}
              className="category-card"
            >
              <span>

                {category.isEditing ?

                  <input
                    value={editText}
                    autoFocus
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleKeepCategory(category.id, editText)
                        handleEditCategory(category.id)
                      }
                    }}
                  />
                :
                  category.name
                }

              </span>

                {category.isEditing ? 

                  <button onClick={() => {
                    handleKeepCategory(category.id, editText),
                    handleEditCategory(category.id)
                  }}>
                    保存
                  </button>
                :
                  <button onClick={() => {
                    handleEditCategory(category.id),
                    textCopy(category.name)
                  }}>
                    編集
                  </button>

                }

            </div>

          ))}

        </div>

        <Link to="/tasks">
          <button>戻る</button>
        </Link>

      </div>
    </>
  )
}

export default TodoCategoryView