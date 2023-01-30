import { chalk } from 'zx'

import timeEntries from './time-entries.js'


export default {
    run: async ({ user_id, day }) => {
        const entries = (await timeEntries.ofDay({ user_id, day })).reverse()

        if(entries.length === 0) {
            console.log(chalk.green(`🍻 Nothing for ${day}`))
            return
        }

        entries.forEach(
            (e) => console.log(timeEntries.format.short(e))
        )

        const hours = entries.reduce((total, { hours }) => total + hours, 0)
        console.log(
               `⌚ Total hours: ${timeEntries.format.duration({ hours })}`
        )
    }
}