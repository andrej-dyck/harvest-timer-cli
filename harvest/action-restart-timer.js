import prompt, { namedChoices } from '../utils/prompt.js'
import dates from '../utils/dates.js'

import api from './api.js'
import timeEntries from './time-entries.js'
import { chalk } from 'zx'

const entriesOf = (user_id, date) =>
    api.time.entries(user_id, { from: dates.toIsoDayString(date), is_running: false })

const run = async (logger, user_id) => {
    const todaysEntries = await entriesOf(user_id, new Date())

    if (todaysEntries.length === 0) {
        console.log(chalk.green('no other entries today'))
        return
    }

    const { entry } = await prompt.ask(
        prompt.question.select({
            name: 'entry',
            message: 'Which one?',
            choices: namedChoices(todaysEntries, (e) => timeEntries.format.short(e))
        })
    )

    const restarted = await timeEntries.restart(entry)
    console.log(timeEntries.format.restarted(restarted))
}

export default { run }