import type { Todo } from "../components/types"
import { getTodosByDate, getCompletedTodos, getTodosByCategory, getTodosInRange } from "./filterUtils"

function calculateStats(todos: Todo[], today: string, selectedDate: string) {

    const todayAchievement = () => {
        const todayTodos = getTodosByDate(todos, today)
        if (todayTodos.length === 0) return 0
        const completed = getCompletedTodos(todayTodos).length

        return Math.floor((completed / todayTodos.length) * 100)
    }

    const wholeAchievement = () => {
        if (todos.length === 0) return 0
        const completedTodos = getCompletedTodos(todos).length

        return Math.floor((completedTodos / todos.length) * 100)
    }

    const designationAchievement = (dayNumber: number) => {
        if (todos.length === 0) return 0
        const date = new Date(today)

        date.setDate(date.getDate() - dayNumber)
        const formatted = new Intl.DateTimeFormat("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).format(date) 
            
        const rengeDate = getTodosInRange(todos, today, formatted)

        const completed = getCompletedTodos(rengeDate).length
        return Math.floor((completed / rengeDate.length) * 100)
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

            const newTodos = getTodosByDate(todos, formatted)

            if (newTodos.length === 0) {
                if (formatted === today) {
                    date.setDate(date.getDate() - 1)
                    continue
                } else {
                    return dayNumber
                }
            }
            const completed = getCompletedTodos(newTodos).length
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

    function getProgressByCategory(categoryId: number) {

        const todayDate = getTodosByDate(todos, selectedDate)

        const todosInCategory = getTodosByCategory(todayDate, categoryId) ?? []

        const completedCount = getCompletedTodos(todosInCategory).length

        if (todosInCategory.length === 0) return "未開始"

        return Math.floor((completedCount / todosInCategory.length) * 100)
    }

    function monthlyAchievement(month: Date) {
        const monthString = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`

        const monthlyTodos = todos.filter(todo =>
            todo.todoDate.startsWith(monthString)
        )
        if (monthlyTodos.length === 0) return 0
        const completed = getCompletedTodos(monthlyTodos).length

        return Math.floor((completed / monthlyTodos.length) * 100)
    }

    return {
        todayAchievement,
        wholeAchievement,
        continuousAchievement,
        designationAchievement,
        getProgressByCategory,
        monthlyAchievement
    }
}

export default calculateStats