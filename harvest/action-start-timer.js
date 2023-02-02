import prompt, { namedChoices } from '../utils/prompt.js'
import api from './api.js'
import formatting from './formatting.js'
import projects from './projects.js'

const startTimer = async () => {
    const project = await chooseProject()
    if (!project) return

    const task = await chooseTask(project)
    if (!task) return

    const notes = await inputNotes()

    const started = await api.time.startNow({ project_id: project.id, task_id: task.id, notes })

    return { output: formatting.timeEntry.started(started) }
}

const chooseProject = async () => {
    const choices = [
        ...namedChoices(await projects.current(), ({ name }) => name),
        prompt.choices.cancel
    ]
    const { project } = await prompt.ask(
        prompt.question.select({
            name: 'project',
            message: 'What project?',
            choices
        })
    )
    return prompt.answers.isCancel(project) ? undefined : project
}

const chooseTask = async ({ tasks }) => {
    const choices = [
        ...namedChoices(tasks, ({ name }) => name),
        prompt.choices.cancel
    ]
    const { task } = await prompt.ask(
        prompt.question.select({
            name: 'task',
            message: 'What task of that project?',
            choices
        })
    )
    return prompt.answers.isCancel(task) ? undefined : task
}

const inputNotes = async () =>
    await prompt.ask(
        prompt.question.input({
            name: 'notes',
            message: 'Notes'
        })
    ).then(({ notes }) => notes.trim())

export default {
    run: () => startTimer()
}