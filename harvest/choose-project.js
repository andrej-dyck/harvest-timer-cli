import prompt from '../utils/prompt.js'
import projects from './projects.js'

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

const chooseTask = async ({ tasks, name: project_name }) =>
    await prompt.selection({
        message: `What task of project ${chalk.bold(project_name)}?`,
        choices: [
            ...prompt.choices.named(tasks, ({ name }) => name),
            prompt.choices.cancel
        ]
    }).then(
        (t) => prompt.choices.takeIfNotCanceled(t)
    )

export default {
    current: chooseProject,
    task: chooseTask,
    taskByProjectId: async ({ id }) => chooseTask(await projects.byId({ id }))
}