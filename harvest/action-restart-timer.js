import calendar from '../utils/calendar.js'
import workdays from '../utils/workdays.js'

import api from './api.js'
import chooseEntry from './choose-entry.js'
import formatting from './formatting.js'
import inputTime from './input-time.js'

const restartEntry = async ({ user_id, day }) => {
    const entry = await chooseEntry({ user_id, day })
    if (!entry) return

    const started_time = await inputTime.started()

    const restarted = await api.time.startToday({
        project_id: entry.project.id,
        task_id: entry.task.id,
        notes: entry.notes,
        started_time
    })
    return { output: formatting.timeEntry.started(restarted) }
}

export default {
    run: async ({ user_id, noEntryToday }) => {
        const today = calendar.today()
        const day = noEntryToday === true ? workdays.precedingWorkday(today) : today

        return await restartEntry({ user_id, day })
    }
}