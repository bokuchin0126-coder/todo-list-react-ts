import type { View, Category } from '../types'

type Props = {
    selectedCategoryId: number | null
    setSelectedCategoryId: (number: number) => void
    view: View
    setView: (view: View) => void
}

function TodoDetailView({ selectedCategoryId, setSelectedCategoryId, view, setView }: Props) {
    return (
        <div className="detail">
          <h2>カテゴリ</h2>

          <button onClick={() => {
            setSelectedCategoryId(1)
            setView("list")
          }}>勉強</button>

          <button onClick={() => {
            setSelectedCategoryId(2)
            setView("list")
          }}>筋トレ</button>
        </div>
    )
}

export default TodoDetailView