import { describe, test, expect, beforeEach } from "vitest"
import { getChangeDate } from "./dateUtils"

const today = "2026-06-16"

describe("getChangeDate", () => {
    test("returns the previous day when moving back one day", () => {
        expect(getChangeDate(today, today, -1)).toBe("2026-06-15")
    })

    test("returns the next day when moving forward one day", () => {
        expect(getChangeDate("2026-05-20", today, 1)).toBe("2026-05-21")
    })

    test("returns today when trying to move pest today", () => {
        expect(getChangeDate(today, today, 1)).toBe(today)
    })

    test("moves to the next month correctly", () => {
        expect(getChangeDate("2026-06-01", today, -1)).toBe("2026-05-31")
    })
})

