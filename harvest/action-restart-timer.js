import calendar from '../utils/calendar.js'
import workdays from '../utils/workdays.js'

import api from './api.js'
import chooseEntry from './choose-entry.js'
import formatting from './formatting.js'

const restartEntry = async ({ user_id, day }) => {
    const entry = await chooseEntry({ user_id, day })
    if (!entry) return

    const restarted = await api.time.restart(entry)
    return { output: formatting.timeEntry.started(restarted) }
}

export default {
    run: async ({ user_id, noEntryToday }) => {
        const today = calendar.today()
        const day = noEntryToday === true ? workdays.precedingWorkday(today) : today

        return await restartEntry({ user_id, day })
    }
}