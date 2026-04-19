import type { View } from '../types'

type Props = {
    categoryId: number | null
    view: View
    setView: (view: View) => void
}

function TodoDetailView({ categoryId, view, setView }: Props) {
    return (
        <div className="detail">
          <h2>カテゴリ詳細</h2>

          <p>選択中ID: {categoryId ?? "未選択"}</p>
        
          <button onClick={() => setView("list")}>← 戻る</button>

          <div>
            <p>ここにタスクが入る予定</p>
          </div>
        </div>
    )
}

export default TodoDetailView