import dayjs from 'dayjs'
import { chalk } from 'zx'
import once from '../utils/once.js'
import timeEntries from './time-entries.js'

once.initSync('dayjs-is-today', () => {
    dayjs.extend(require('dayjs/plugin/isToday'))
})

const showEntries = (entries) =>
    withBreaks(
        highlightOverlaps(entries)
    ).forEach(
        (e) => console.log(
            '• ' + (typeof e === 'string' ? e : timeEntries.format.oneLine(e))
        )
    )

const withBreaks = (entries) =>
    entries.length < 2 ? entries : [
        entries[0],
        ...endStartDiffs(entries).flatMap(
            ({ e2, diff }) => diff > 1 ? [chalk.grey(`☕ ${diff} minutes break`), e2] : [e2]
        )
    ]

const highlightOverlaps = (entries) =>
    entries.length < 2 ? entries : [
        entries[0],
        ...endStartDiffs(entries).map(
            ({ e2, diff }) => diff <= -1 ? { ...e2, started_time: chalk.red(e2.started_time) } : e2
        )
    ]

const endStartDiffs = (entries) =>
    windowed(entries, 2).map(
        ([e1, e2]) => {
            const e1End = dayjs(e1.spent_date + 'T' + e1.ended_time)
            const e2Start = dayjs(e2.spent_date + 'T' + e2.started_time)

            return { e1, e2, diff: e2Start.diff(e1End, 'minute') }
        }
    )

const windowed = (array, size) => Array.from(
    { length: array.length - (size - 1) },
    (_, index) => array.slice(index, index + size)
)

const showTotal = (entries) => {
    const hours = entries.reduce((total, { hours }) => total + hours, 0)
    console.log(`⌚ Total hours: ${chalk.bold(timeEntries.format.duration({ hours }))}`)
}

export default {
    run: async ({ user_id, day }) => {
        console.log(chalk.bold(day.format('ddd, DD.MM.YYYY')))

        const entries = (await timeEntries.ofDay({ user_id, day })).reverse()

        if (entries.length === 0) {
            console.log(chalk.green(day.isToday() ? '🌄 A fresh day ...' : `🍻 Nothing for ${day}`))
            return { latest: undefined }
        }

        showEntries(entries)
        showTotal(entries)

        return { latest: entries[entries.length - 1] }
    }
}