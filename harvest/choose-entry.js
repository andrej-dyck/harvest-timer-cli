import prompt, { namedChoices } from '../utils/prompt.js'

import chooseDay from './choose-day.js'
import formatting from './formatting.js'
import timeEntries from './time-entries.js'

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

    if (entry === 'choose day') return chooseEntry({ user_id, day: await chooseDay({ current: day }) })
    return prompt.answers.takeIfNotCanceled(entry)
}

export default chooseEntry