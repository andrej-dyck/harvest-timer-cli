import prompt from '../utils/prompt.js'

import api from './api.js'
import formatting from './formatting.js'
import inputNotes from './input-notes.js'
import inputTime from './input-time.js'
import projects from './projects.js'

const startTimer = async () => {
    const project = await chooseProject()
    if (!project) return

    const task = await chooseTask(project)
    if (!task) return

    const notes = await inputNotes()

    const started_time = await inputTime.started()

    const started = await api.time.startToday({ project_id: project.id, task_id: task.id, notes, started_time })
    return { output: formatting.timeEntry.started(started) }
}

const chooseProject = async () =>
    await prompt.selection({
        message: 'What project?',
        choices: [
            ...prompt.choices.named(await projects.current(), ({ name }) => name),
            prompt.choices.cancel
        ]
    }).then(
        (p) => prompt.choices.takeIfNotCanceled(p)
    )

const chooseTask = async ({ tasks }) =>
    await prompt.selection({
        message: 'What task of that project?',
        choices: [
            ...prompt.choices.named(tasks, ({ name }) => name),
            prompt.choices.cancel
        ]
    }).then(
        (t) => prompt.choices.takeIfNotCanceled(t)
    )

export default {
    run: startTimer
}