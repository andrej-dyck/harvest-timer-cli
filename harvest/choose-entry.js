import prompt from '../utils/prompt.js'

import chooseDay from './choose-day.js'
import formatting from './formatting.js'
import timeEntries from './time-entries.js'

const chooseEntry = async ({ user_id, day }) => {
    const entries = (await timeEntries.ofDay({ user_id, day }))
        .filter(({ is_running }) => is_running === false)

    const entry = await prompt.selection({
        message: `Which entry of ${day.format('ddd, DD.MM.YYYY')}?`,
        choices: [
            ...prompt.choices.named(entries, (e) => formatting.timeEntry.oneLiner(e)),
            { name: '📅 another day ...', value: 'choose day' },
            prompt.choices.cancel,
        ]
    }).then(
        (e) => prompt.choices.takeIfNotCanceled(e)
    )

    return entry === 'choose day'
        ? chooseEntry({ user_id, day: await chooseDay({ current: day }) })
        : entry
}

export default chooseEntry