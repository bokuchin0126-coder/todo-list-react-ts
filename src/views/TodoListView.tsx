import  TodoItem  from '../components/TodoItem'
import type { Filter, Todo } from '../components/types'
import { Link } from "react-router-dom" 
import { TodoContext } from "../context/TodoContext"
import { useContext } from "react" 
import '../css/todo-list.css'


type Props = {
  filteredTodos: Todo[]
  searchText: string
  filter: Filter
  setSearchText: (text: string) => void
  setFilter: (filter: Filter) => void
  handleChangeDate: (number: number) => void
}

function TodoListView({ filteredTodos, searchText, filter, setSearchText, 
  setFilter, handleChangeDate}: Props) {

    const todoContext = useContext(TodoContext)
    if (!todoContext) return null

    const { todos, selectedDate } = todoContext


  return (
  <>
    <div className="page-header">
      <div>
        <h1>タスク一覧</h1>
        <p>今日やることを整理して、効率的に進めましょう</p>
      </div>
    </div>

    <div className="top-toolbar">

      <div className="date-toolbar">

        <button
          className="icon-button"
          onClick={() => handleChangeDate(-1)}
        >
          ←
        </button>

        <div className="date-box">
          {selectedDate}
        </div>

        <button
          className="icon-button"
          onClick={() => handleChangeDate(1)}
        >
          →
        </button>

      </div>

      <input
        className="search-input"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="🔍 タスクを検索"
      />

      <Link to="/tasks/new">
        <button className="add-button">
          ＋ 新しいタスク
        </button>
      </Link>

    </div>

    <div className="filter-tabs">

      <button
        className={filter === "all" ? "active-filter" : ""}
        onClick={() => setFilter("all")}
      >
        全て
      </button>

      <button
        className={filter === "active" ? "active-filter" : ""}
        onClick={() => setFilter("active")}
      >
        未完了
      </button>

      <button
        className={filter === "completed" ? "active-filter" : ""}
        onClick={() => setFilter("completed")}
      >
        完了
      </button>

    </div>

    <div className="todo-table">

      <div className="table-header">

        <div className="task">タスク名</div>
        <div className="category">カテゴリ</div>
        <div className="status">ステータス</div>
        <div className="time">作成時間</div>
        <div className="operation">操作</div>

      </div>

      <div className="todo-content">

        {filteredTodos.length === 0 ? (

          <div className="empty-state">
            該当するタスクがありません
          </div>

        ) : (

          filteredTodos.map((todo) => (

            <TodoItem
              key={todo.id}
              todo={todo}
              searchText={searchText}
            />

          ))

        )}

      </div>

    </div>
  </>
  )
}

export default TodoListView