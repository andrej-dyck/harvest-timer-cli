import dayjs from 'dayjs'
import prompt, { namedChoices } from '../utils/prompt.js'
import timeEntries from './time-entries.js'

const restartEntry = async ({ user_id, day }) => {
    const entry = await chooseEntry({ user_id, day })
    if (!entry) return

    const restarted = await timeEntries.restart(entry)
    console.log(timeEntries.format.restarted(restarted))
}

const chooseEntry = async ({ user_id, day }) => {
    const entries = (await timeEntries.ofDay({ user_id, day }))
        .filter(({ is_running }) => is_running === false)
        .reverse()

    const choices = [
        ...namedChoices(entries, (e) => timeEntries.format.oneLine(e)),
        { name: '📅 another day ...', value: 'choose day' },
        { name: '❌ cancel', value: 'cancel' },
    ]

    const { entry } = await prompt.ask(
        prompt.question.select({
            name: 'entry',
            message: `Which entry of ${day.format('ddd, DD.MM.YYYY')}?`,
            choices: choices
        })
    )

    if (entry === 'cancel') return undefined
    if (entry === 'choose day') return chooseEntry({ user_id, day: await chooseDay({ current: day }) })
    return entry
}

const chooseDay = async ({ current }) => {
    const today = dayjs().startOf('day')

    const days = [0, 1, 2, 3, 4, 5, 6, 7]
        .map((d) => today.subtract(d, 'day'))
        .filter((d) => isWorkday(d) && !d.isSame(current, 'day'))

    return prompt.ask(
        prompt.question.select({
            name: 'day',
            message: 'Which day?',
            choices: namedChoices(days, (d) => d.format('ddd, DD.MM.YYYY'))
        })
    ).then(({ day }) => day)
}

const isWorkday = (date) => date.day() > 0 && date.day() < 6

const previousWorkday = (date) => {
    const previous = date.subtract(1, 'day')
    return isWorkday(previous) ? previous : previousWorkday(previous)
}

export default {
    run: async ({ user_id, noEntryToday }) => {
        const today = dayjs().startOf('day')
        const day = noEntryToday === true ? previousWorkday(today) : today

        await restartEntry({ user_id, day })
    }
}