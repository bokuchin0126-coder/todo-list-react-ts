import type { Todo } from "../components/types"

function calculateStats(todos: Todo[], selectedDate: string, today: string) {

    const todayAchievement = () => {
        const todayTodos = todos.filter(todo => todo.todoDate === today)
        if (todayTodos.length === 0) return 0
        const completed = todayTodos.filter(todo => todo.status === "completed").length

        return Math.floor((completed / todayTodos.length) * 100)
    }

    const wholeAchievement = () => {
        const completedTodos = todos.filter(todo => todo.status === "completed").length

        return Math.floor((completedTodos / todos.length) * 100)
    }

    const continuousAchievement = () => {
        const date = new Date(today)
        let dayNumber = 0

        for (let i = 0; i < todos.length; i++) {
            const formatted = new Intl.DateTimeFormat("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).format(date)

            const newTodos = todos.filter(todo => todo.todoDate === formatted)

            if (newTodos.length === 0) {
                if (formatted === today) {
                    date.setDate(date.getDate() - 1)
                    continue
                } else {
                    return dayNumber
                }
            }
            const completed = newTodos.filter(todo => todo.status === "completed").length
            const achievement = (completed / newTodos.length)

            if (formatted === today) {
                if (achievement === 1) {
                    dayNumber += 1
                    date.setDate(date.getDate() - 1)
                } else {
                    date.setDate(date.getDate() - 1)
                    continue
                }
            } else if ( achievement === 1) {
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