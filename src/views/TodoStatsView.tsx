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
        <div className="stats-grid">

            <div className="stats-card">
                <h3>今日の達成率</h3>
                <p>{todayAchievement()}%</p>
            </div>

            <div className="stats-card">
                <h3>過去７日間</h3>
                <p>{designationAchievement(7)}%</p>
            </div>

             <div className="stats-card">
                <h3>過去３０日間</h3>
                <p>{designationAchievement(30)}%</p>
            </div>

             <div className="stats-card">
                <h3>総達成率</h3>
                <p>{wholeAchievement()}%</p>
            </div>

             <div className="stats-card">
                <h3>連続達成日数</h3>
                <p>{continuousAchievement()}日</p>
            </div>
            
        </div>
        </>
    )
}

export default TodoStatsView