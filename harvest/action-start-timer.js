import api from './api.js'
import chooseProject from './choose-project.js'
import formatting from './formatting.js'
import inputNotes from './input-notes.js'
import inputTime from './input-time.js'

const startTimer = async () => {
    const args = await promptForNewTimer()
    if (!args) return

    return { output: await startedTimer(args) }
}

const promptForNewTimer = async () => {
    const project = await chooseProject.current()
    if (!project) return

    const task = await chooseProject.task(project)
    if (!task) return

    const notes = await inputNotes()

    const started_time = await inputTime.started({ now: () => undefined })

    return { project, task, notes, started_time }
}

const startedTimer = async ({ project: { id: project_id }, task: { id: task_id }, notes, started_time }) => {
    const started = await api.time.startToday({ project_id, task_id, notes, started_time })
    return formatting.timeEntry.started(started)
}

export default {
    run: startTimer
}