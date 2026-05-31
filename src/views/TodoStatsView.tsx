import { Link } from "react-router-dom" 
import { TodoContext } from "../context/TodoContext"
import { useContext } from "react"


function TodoStatsView() {
    return (
        <>
        <div>
            <Link to="/">ホームへ戻る</Link>
        </div>
        </>
    )
}

export default TodoStatsView