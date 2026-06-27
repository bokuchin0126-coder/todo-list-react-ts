import { TodoContext } from "../context/TodoContext"
import { useContext, useState } from "react"
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
    <div className="page-header">
      <div>
        <h1>カテゴリ管理</h1>
        <p>タスクで使用するカテゴリを管理しましょう</p>
      </div>
    </div>

    <div className="category-add">

      <input
        className="category-input"
        value={categoryName}
        placeholder="カテゴリ名を入力"
        onChange={(e) => setCategoryName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddCategory(color)
          }
        }}
      />

      <select
        className={`category-select category-color-tag ${color}`}
        value={color}
        onChange={(e) => setColor(e.target.value as Color)}
      >
        {CATEGORY_COLORS.map((color) => (
          <option
            key={color}
            value={color}
          >
            {color}
          </option>
        ))}
      </select>

      <button
        className="add-category-button"
        onClick={() => handleAddCategory(color)}
      >
        ＋ カテゴリ追加
      </button>

    </div>

    <div className="category-table">

      <div className="category-header">

        <div className="category-name-header">カテゴリ名</div>
        <div className="category-color-header">カラー</div>
        <div className="category-action-header">操作</div>

      </div>

      <div className="category-content">

        {categories.length === 0 ? (

          <div className="empty-state">
            カテゴリがありません
          </div>

        ) : (

          categories.map(category => (

            <div
              key={category.id}
              className="category-row"
            >

              <div className="category-name">

                {category.isEditing ? (

                  <input
                    className="edit-input"
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

                ) : (

                  <span>{category.name}</span>

                )}

              </div>

              <div>

                <select
                  className={`category-select category-color-tag ${category.color}`}
                  value={category.color}
                  onChange={(e) =>
                    handleKeepColorCategory(
                      category.id,
                      e.target.value as Color
                    )
                  }
                >
                  {CATEGORY_COLORS.map((color) => (
                    <option
                      className={`category-select category-color-tag ${color}`}
                      key={color}
                      value={color}
                    >
                      {color}
                    </option>
                  ))}
                </select>

              </div>

              <div className="category-actions">

                {category.isEditing ? (

                  <button
                    className="save-button"
                    onClick={() => {
                      handleKeepTextCategory(category.id, editText)
                      handleEditCategory(category.id)
                    }}
                  >
                    保存
                  </button>

                ) : (

                  <button
                    className="edit-button"
                    onClick={() => {
                      handleEditCategory(category.id)
                      textCopy(category.name)
                    }}
                  >
                    編集
                  </button>

                )}

                <button
                  className="delete-button"
                  onClick={() => {

                    const isDelete = window.confirm(
                      "削除すると選択したカテゴリは「未分類」となります。本当に削除しますか？"
                    )

                    if (isDelete) {
                      handleDeleteCategory(category.id)
                    }

                  }}
                >
                  削除
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  </>
  )
}
 
export default TodoCategoryView