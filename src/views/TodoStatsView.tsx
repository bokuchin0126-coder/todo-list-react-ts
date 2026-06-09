import { Link } from "react-router-dom" 
import calculateStats from "../utils/calculateStats"
import { TodoContext } from "../context/TodoContext"
import { useContext } from "react"

type Props = {
    today: string
}

function TodoStatsView({ today }: Props) {

    const todoContext = useContext(TodoContext)
    if (!todoContext) return null

    const { todos, selectedDate } = todoContext

    const {
        todayAchievement,
        wholeAchievement,
        continuousAchievement
    } = calculateStats(todos, selectedDate, today)


    return (
        <>
        <div>
            <p>今日の達成率{todayAchievement()}%</p>
            <p>総達成率{wholeAchievement()}%</p>
            <p>連続達成日数{continuousAchievement()}日</p>
            <Link to="/">ホームへ戻る</Link>
        </div>
        </>
    )
}

export default TodoStatsView