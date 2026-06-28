import calculateStats from "../utils/calculateStats"
import { TodoContext } from "../context/TodoContext"
import { useContext, useState } from "react"
import "../css/todo-stats.css"


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

    const monthlyRate = monthlyAchievement(selectedMonth)

    const todayDate = new Date()

    const changeMonth = (number: number) => setSelectedMonth(prev => {
        const next = new Date(prev)
        next.setMonth(next.getMonth() + number)

        const currentMonth = todayDate.getFullYear() * 12 + todayDate.getMonth()
        const nextMonth = next.getFullYear() * 12 + next.getMonth()

        if (currentMonth < nextMonth) {
            return prev
        }

        return next
    })


    return (
    <div className="stats-page">

        <div className="stats-header">

            <div>
                <h1>統計</h1>
                <p>あなたのタスク達成状況を確認しましょう</p>
            </div>

            <div className="month-selector">
                <button onClick={() => changeMonth(-1)}>
                    ◀
                </button>

                <span>
                    {selectedMonth.getFullYear()}年
                    {selectedMonth.getMonth() + 1}月
                </span>

                <button
                    onClick={() => changeMonth(1)}
                    disabled={
                        selectedMonth.getFullYear() === todayDate.getFullYear() &&
                        selectedMonth.getMonth() === todayDate.getMonth()
                    }
                >
                    ▶
                </button>
            </div>

        </div>

        <div className="stats-summary">

            <div className="summary-card">
                <h3>今日の達成率</h3>

                <div className="summary-value">
                    {todayAchievement()}%
                </div>

                <div className="summary-progress">
                    <div
                        className="summary-fill blue"
                        style={{
                            width: `${todayAchievement()}%`
                        }}
                    />
                </div>
            </div>

            <div className="summary-card">
                <h3>過去7日間</h3>

                <div className="summary-value purple">
                    {designationAchievement(7)}%
                </div>

                <div className="summary-progress">
                    <div
                        className="summary-fill purple"
                        style={{
                            width: `${designationAchievement(7)}%`
                        }}
                    />
                </div>
            </div>

            <div className="summary-card">
                <h3>過去30日間</h3>

                <div className="summary-value green">
                    {designationAchievement(30)}%
                </div>

                <div className="summary-progress">
                    <div
                        className="summary-fill green"
                        style={{
                            width: `${designationAchievement(30)}%`
                        }}
                    />
                </div>
            </div>

            <div className="summary-card">
                <h3>総達成率</h3>

                <div className="summary-value orange">
                    {wholeAchievement()}%
                </div>

                <div className="summary-progress">
                    <div
                        className="summary-fill orange"
                        style={{
                            width: `${wholeAchievement()}%`
                        }}
                    />
                </div>
            </div>

            <div className="summary-card streak">
                <h3>連続達成日数</h3>

                <div className="summary-value pink">
                    {continuousAchievement()}日
                </div>
            </div>

        </div>

        <div className="monthly-card">

            <div className="monthly-header">

                <h2>月別達成率</h2>

                <div className="month-selector">

                    <button onClick={() => changeMonth(-1)}>
                        ◀
                    </button>

                    <span>
                        {selectedMonth.getFullYear()}年
                        {selectedMonth.getMonth() + 1}月
                    </span>

                    <button
                        onClick={() => changeMonth(1)}
                        disabled={
                            selectedMonth.getFullYear() === todayDate.getFullYear() &&
                            selectedMonth.getMonth() === todayDate.getMonth()
                        }
                    >
                        ▶
                    </button>

                </div>

            </div>

            <div className="monthly-content">

                <div className="circle-area">

                    <div
                      className="circle-progress"
                      style={
                        {
                          "--progress": monthlyRate,
                        } as React.CSSProperties
                      }
                    >

                        <div className="circle-inner">

                            <span>{monthlyRate}%</span>

                            <p>今月の達成率</p>

                        </div>

                    </div>

                </div>

                <div className="bar-area">

                    <div className="bar-background">

                        <div
                            className="bar-fill"
                            style={{
                                width: `${monthlyRate}%`
                            }}
                        />

                    </div>

                    <p className="bar-label">
                        達成率 {monthlyRate}%
                    </p>

                </div>

            </div>

        </div>

    </div>
    )
}

export default TodoStatsView