import { Link, Outlet } from "react-router-dom"
import "../css/Layout.css"

function Layout() {
  return (
    <div className="app-layout">

        <aside className="sidebar">
          <h2>TodoList</h2>

          <Link to="/tasks">
            タスク一覧
          </Link>

          <Link to="/tasks/stats">
            統計
          </Link>

          <Link to="/tasks/categories">
            カテゴリ
          </Link>
        </aside>

        <main className="main-content">
            <Outlet />
        </main>

    </div>
  )
}

export default Layout