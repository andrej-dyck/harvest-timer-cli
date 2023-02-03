import calendar from '../utils/calendar.js'
import prompt, { namedChoices } from '../utils/prompt.js'
import workdays from '../utils/workdays.js'
import actionChooseDay from './action-choose-day.js'
import formatting from './formatting.js'
import timeEntries from './time-entries.js'

const restartEntry = async ({ user_id, day }) => {
    const entry = await chooseEntry({ user_id, day })
    if (!entry) return

    const restarted = await timeEntries.restart(entry)
    return { output: formatting.timeEntry.started(restarted) }
}

const chooseEntry = async ({ user_id, day }) => {
    const entries = (await timeEntries.ofDay({ user_id, day }))
        .filter(({ is_running }) => is_running === false)

    const choices = [
        ...namedChoices(entries, (e) => formatting.timeEntry.oneLiner(e)),
        { name: '📅 another day ...', value: 'choose day' },
        prompt.choices.cancel,
    ]

    const { entry } = await prompt.ask(
        prompt.question.select({
            name: 'entry',
            message: `Which entry of ${day.format('ddd, DD.MM.YYYY')}?`,
            choices
        })
    )

    return entry === 'choose day'
        ? chooseEntry({ user_id, ...await actionChooseDay.run({ current: day }) })
        : prompt.answers.takeIfNotCanceled(entry)
}

export default {
    run: async ({ user_id, noEntryToday }) => {
        const today = calendar.today()
        const day = noEntryToday === true ? workdays.precedingWorkday(today) : today

        return await restartEntry({ user_id, day })
    }
}