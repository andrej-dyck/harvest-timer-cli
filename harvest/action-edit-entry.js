import calendar from '../utils/calendar.js'
import object from '../utils/object.js'
import prompt from '../utils/prompt.js'
import workdays from '../utils/workdays.js'
import api from './api.js'

import chooseEntry from './choose-entry.js'
import chooseProject from './choose-project.js'
import formatting from './formatting.js'
import inputNotes from './input-notes.js'
import inputTime from './input-time.js'

const editEntry = async ({ user_id, day }) => {
    const entry = await chooseEntry({ user_id, day, filterRunning: false })
    if (!entry) return

    const edits = await promptForEdits(entry)
    if (object.isEmpty(edits)) return

    const updated = await api.time.updateEntry(entry, edits)
    return { output: formatting.timeEntry.oneLiner(updated) }
}

const promptForEdits = async (entry) => {
    const edits = {}

    const choices = [
        { name: 'notes', value: 'notes' },
        { name: 'start time', value: 'started_time' },
        { name: 'end time', value: 'ended_time' },
        { name: 'task', value: 'task_id' },
        prompt.choices.cancel
    ]

    let value = undefined
    const nonValues = new Set(['confirm', prompt.choices.cancel.value])
    while (!nonValues.has(value)) {
        value = await prompt.selection({
            message: `Edit:`,
            choices: object.isEmpty(edits)
                ? choices
                : [{ name: `💾 confirm ${JSON.stringify(edits)}`, value: 'confirm' }, ...choices]
        })

        if (value === 'notes')
            edits.notes = await inputNotes({ defaultNotes: entry.notes })
        if (value === 'task_id')
            edits.task_id = await chooseProject.taskByProjectId(entry.project).then((t) => t?.id)
        if (value === 'started_time')
            edits.started_time = await inputTime.started({ defaultTime: entry.started_time })
        if (value === 'ended_time')
            edits.ended_time = await inputTime.ended({ defaultTime: entry.ended_time })
    }

    return value === 'confirm' ? edits : {}
}

export default {
    run: async ({ user_id, noEntryToday }) => {
        const today = calendar.today()
        const day = noEntryToday === true ? workdays.precedingWorkday(today) : today

        return await editEntry({ user_id, day })
    }
}