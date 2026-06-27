import { Outlet, Link, useLocation } from "react-router-dom"
import {
  CheckSquare,
  BarChart3,
  FolderOpen,
  CheckCheck,
  User
} from "lucide-react"

import "../css/sidebar.css"

function Layout() {

  const location = useLocation()

  return (
    <div className="app-layout">

      <aside className="sidebar">

        <div>

          <div className="sidebar-logo">

            <div className="logo-icon">
              <CheckCheck size={18} strokeWidth={3} />
            </div>

            <h2>TodoList</h2>

          </div>

          <nav className="sidebar-nav">

            <Link
              to="/tasks"
              className={
                location.pathname === "/tasks"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <CheckSquare size={20} />
              <span>タスク一覧</span>
            </Link>

            <Link
              to="/tasks/stats"
              className={
                location.pathname === "/tasks/stats"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <BarChart3 size={20} />
              <span>統計</span>
            </Link>

            <Link
              to="/tasks/categories"
              className={
                location.pathname === "/tasks/categories"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <FolderOpen size={20} />
              <span>カテゴリ</span>
            </Link>

          </nav>

        </div>

        <div className="sidebar-user">

          <div className="user-avatar">
            <User size={18} />
          </div>

          <div>

            <div className="user-name">
              User
            </div>

            <div className="user-email">
              user@example.com
            </div>

          </div>

        </div>

      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

    </div>
  )
}

export default Layout