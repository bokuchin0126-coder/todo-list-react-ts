import { Link } from "react-router-dom" 
import calculateStats from "../utils/calculateStats"
import { TodoContext } from "../context/TodoContext"
import { useContext, useState } from "react"


function TodoStatsView() {

    const todoContext = useContext(TodoContext)
    if (!todoContext) return null

    const { todos, today, selectedDate } = todoContext

    const {
        todayAchievement,
        wholeAchievement,
        continuousAchievement,
        designationAchievement,
        monthlyAchievement
    } = calculateStats(todos, today, selectedDate)

    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())

    const changeMonth = (number: number) => setSelectedMonth(prev => {
        const next = new Date(prev)
        next.setMonth(next.getMonth() + number)
        
        const today = new Date()

        const currentMonth = today.getFullYear() * 12 + today.getMonth()
        const nextMonth = next.getFullYear() * 12 + next.getMonth()

        if (currentMonth < nextMonth) {
            return prev
        }

        return next
    })


    return (
        <>
        <div className="stats-grid">

            <div className="stats-card">
                <h3>月別達成率</h3>

                <div className="month-selector">
                    <button onClick={() => changeMonth(-1)}>◀</button>

                    <span>
                        {selectedMonth.getFullYear()}年
                        {selectedMonth.getMonth() + 1}月
                    </span>

                    <button 
                      onClick={() => changeMonth(1)}
                      disabled={selectedMonth.getMonth() === new Date().getMonth()}
                    >
                        ▶
                    </button>
                </div>

                <p className="monthly-rate">
                    {monthlyAchievement(selectedMonth)}%
                </p>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                        width: `${monthlyAchievement(selectedMonth)}%`,
                        }}
                    />
                </div>
            </div>

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