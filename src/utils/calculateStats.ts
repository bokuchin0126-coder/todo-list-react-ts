import type { DailyTodo } from "../components/types"

function calculateStats(dailyTodos: DailyTodo[], selectedDate: string, today: string) {

    const todayAchievement = () => {
        const todayDate = dailyTodos.find(day => day.date === today)
        const todayTodos = todayDate?.todos ?? []
        if (todayTodos.length === 0) return 0
        const completed = todayTodos.filter(todo => todo.status === "completed").length

        return Math.floor((completed / todayTodos.length) * 100)
    }

    const wholeAchievement = () => {
        const wholeTodos = dailyTodos.flatMap(day => day.todos ?? [])
        const completedTodos = wholeTodos.filter(todo => todo.status === "completed").length

        return Math.floor((completedTodos / wholeTodos.length) * 100)
    }

    const continuousAchievement = () => {
        const date = new Date(today)
        let dayNumber = 0

        for (let i = 0; i < dailyTodos.length; i++) {
            const formatted = new Intl.DateTimeFormat("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).format(date)

            const newDate = dailyTodos.find(day => day.date === formatted)
            const newTodos = newDate?.todos ?? []
            if (newTodos.length === 0) {
                date.setDate(date.getDate() - 1)
                continue
            }
            const completed = newTodos.filter(todo => todo.status === "completed").length
            const achievement = (completed / newTodos.length)

            if (newDate?.date === today) {
                if (achievement === 1) {
                    dayNumber += 1
                    date.setDate(date.getDate() - 1)
                } else {
                    date.setDate(date.getDate() - 1)
                    continue
                }
            }

            if ( achievement === 1) {
                dayNumber += 1
                date.setDate(date.getDate() - 1)
            } else {
                return dayNumber
            }
        }
        return dayNumber
    }

    return {
        todayAchievement,
        wholeAchievement,
        continuousAchievement
    }
}

export default calculateStats