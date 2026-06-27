import { TodoContext } from "../context/TodoContext"
import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom" 
import { type Color, CATEGORY_COLORS } from '../components/types'
import '../css/todo-category.css'


type Props = {
  categoryName: string
  setCategoryName: (string: string) => void
  handleAddCategory: (color: Color) => void
  handleEditCategory: (id: number) => void
  handleKeepTextCategory: (id: number, text: string) => void
  handleKeepColorCategory: (id: number, color: Color) => void
  handleDeleteCategory: (id: number) => void
}

function TodoCategoryView({ categoryName, setCategoryName, handleAddCategory, handleEditCategory,
  handleKeepTextCategory, handleKeepColorCategory, handleDeleteCategory }: Props) {

  const todoContext = useContext(TodoContext)
    if (!todoContext) return null

  const { categories } = todoContext

  const [editText, setEditText] = useState<string>("")
  const [color, setColor] = useState<Color>("gray")

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
                handleAddCategory(color)
              }
            }}
          />

          <select
            className={`category-tag ${color}`}
            value={color}
            onChange={(e) => setColor(e.target.value as Color)}
          >
            {CATEGORY_COLORS.map((color) => (
                  <option
                    className={`category-tag ${color}`}
                    key={color}
                    value={color}
                  >
                   {color}
                  </option>
                ))}
          </select>

          <button onClick={() => handleAddCategory(color)}>
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
                        handleKeepTextCategory(category.id, editText)
                        handleEditCategory(category.id)
                      }
                    }}
                  />
                :
                  category.name
                }

              </span>

              <select
                className={`category-tag ${category.color}`}
                value={category.color}
                onChange={(e) =>
                  handleKeepColorCategory(category.id, e.target.value as Color)
                }
              >
                {CATEGORY_COLORS.map((color) => (
                  <option
                    className={`category-tag ${color}`}
                    key={color}
                    value={color}
                  >
                   {color}
                  </option>
                ))}
              </select>

                {category.isEditing ? 
                  <button onClick={() => {
                    handleKeepTextCategory(category.id, editText),
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

                <button
                  onClick={() => {
                    const isDelete = window.confirm(
                      "削除すると選択したカテゴリは”未分類”となりますが、本当に削除しますか？"
                    )

                    if (isDelete) {
                      handleDeleteCategory(category.id)
                    }
                  }}
                >
                  削除
                </button>

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