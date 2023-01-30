import prompt, { namedChoices } from '../utils/prompt.js'
import timeEntries from './time-entries.js'
import dayjs from 'dayjs'

const chooseEntry = async ({ user_id, day }) => {
    const entries = (await timeEntries.ofDay({ user_id, day }))
        .filter(({ is_running }) => is_running === false)

    const choices = [
        ...namedChoices(entries, (e) => timeEntries.format.short(e)),
        { name: '📅 another day ...', value: 'choose day' }
    ]
    const { entry } = await prompt.ask(
        prompt.question.select({
            name: 'entry',
            message: `Which entry of ${day.format('ddd, YYYY-MM-DD')}?`,
            choices: choices
        })
    )

    return entry !== 'choose day'
        ? entry
        : chooseEntry({ user_id, day: await chooseDay() })
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

const run = async ({ user_id }) => {
    const entry = await chooseEntry({ user_id, day: dayjs().startOf('day') })

    const restarted = await timeEntries.restart(entry)
    console.log(timeEntries.format.restarted(restarted))
}

export default { run }