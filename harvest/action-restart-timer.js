import dayjs from 'dayjs'
import prompt, { namedChoices } from '../utils/prompt.js'
import timeEntries from './time-entries.js'

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
            message: `Which entry of ${day.format('ddd, YYYY-MM-DD')}?`,
            choices: choices
        })
    )

    if (entry === 'cancel') return undefined
    if (entry === 'choose day') return chooseEntry({ user_id, day: await chooseDay() })
    return entry
}

const chooseDay = async () => {
    const today = dayjs().startOf('day')
    const isWorkday = (d) => d.day() > 0 && d.day() < 6

    const days = [0, 1, 2, 3, 4, 5, 6, 7]
        .map((d) => today.subtract(d, 'day'))
        .filter(isWorkday)

    return prompt.ask(
        prompt.question.select({
            name: 'day',
            message: 'Which day?',
            choices: namedChoices(days, (d) => d.format('ddd, YYYY-MM-DD'))
        })
    ).then(({ day }) => day)
}

export default {
    run: async ({ user_id }) => {
        const entry = await chooseEntry({ user_id, day: dayjs().startOf('day') })
        if (!entry) return

        const restarted = await timeEntries.restart(entry)
        console.log(timeEntries.format.restarted(restarted))
    }
}