import api from './api.js'
import chooseProject from './choose-project.js'
import formatting from './formatting.js'
import inputNotes from './input-notes.js'
import inputTime from './input-time.js'

const startTimer = async () => {
    const project = await chooseProject.current()
    if (!project) return

    const task = await chooseProject.task(project)
    if (!task) return

    const notes = await inputNotes()

    const started_time = await inputTime.started({ now: () => undefined })

    const started = await api.time.startToday({ project_id: project.id, task_id: task.id, notes, started_time })
    return { output: formatting.timeEntry.started(started) }
}

export default {
    run: startTimer
}