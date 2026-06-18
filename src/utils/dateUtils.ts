export function getChangeDate(selectedDate: string, today: string, number: number) {
    const date = new Date(selectedDate)
        date.setDate(date.getDate() + number)

    const formatted = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date)

    if (number >= 0)
        if (selectedDate >= today)
            return today
    
    return formatted
}