import { Link } from "react-router-dom" 
import calculateStats from "../utils/calculateStats"
import { TodoContext } from "../context/TodoContext"
import { useContext } from "react"


function TodoStatsView() {

    const todoContext = useContext(TodoContext)
    if (!todoContext) return null

    const { todos, today, selectedDate } = todoContext

    const {
        todayAchievement,
        wholeAchievement,
        continuousAchievement,
        designationAchievement
    } = calculateStats(todos, today, selectedDate)


    return (
        <>
        <div>
            <p>今日の達成率{todayAchievement()}%</p>
            <p>過去７日間の達成率{designationAchievement(7)}%</p>
            <p>過去３０日間の達成率{designationAchievement(30)}%</p>
            <p>総達成率{wholeAchievement()}%</p>
            <p>連続達成日数{continuousAchievement()}日</p>
            <Link to="/">ホームへ戻る</Link>
        </div>
        </>
    )
}

export default TodoStatsView