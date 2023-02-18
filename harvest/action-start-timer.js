import config from '../config.js'
import prompt from '../utils/prompt.js'

import api from './api.js'
import chooseProject from './choose-project.js'
import formatting from './formatting.js'
import inputNotes from './input-notes.js'
import inputTime from './input-time.js'
import projects from './projects.js'

const startTimer = async () => {
    const customRules = (await config.readStartTimerRules().then((r) => r.rules ?? []))
        .filter((r) => r.enabled !== false)

    const args = customRules.length === 0
        ? await promptForNewTimer()
        : await promptForNewTimerWith(customRules)

    if (!args) return
    return { output: await startedTimer(args) }
}

const promptForNewTimer = async () => {
    const project = await chooseProject.current()
    if (!project) return

    const task = await chooseProject.task(project)
    if (!task) return

    const notes = await inputNotes()

    return { project, task, notes, started_time: await promptForStartedTime() }
}

const promptForStartedTime = () => inputTime.started({ now: () => undefined })

const promptForNewTimerWith = async (rules) => {
    const rule = await prompt.selection({
        message: 'Start ...',
        choices: [...rules.map((r) => ({ name: r.ruleName, value: r })), { name: '🦄 custom', value: 'custom' }]
    })

    if (rule === 'custom') return promptForNewTimer()
    else return applyRule(rule.start)
}

const applyRule = async (flow, inputs = []) => {
    if ('prompt' in flow) {
        return applyRule(flow.then, [...inputs, await promptForInput({ message: flow.prompt, type: flow.type })])
    }

    if ('args' in flow) {
        const args = await resolveArgs(flow.args, inputs)
        return { ...args, started_time: await promptForStartedTime() }
    }

    exit('unknown step {0}', flow)
}

const promptForInput = async ({ message, type }) => {
    if (isType(type, 'input')) {
        return prompt.input({ message, defaultInput: type.defaultInput ?? undefined })
    }

    exit('unknown prompt {0}', type)
}

const isType = (type, expectedType) =>
    typeof type === 'string' ? type === expectedType : type.name === expectedType

const resolveArgs = async (args, inputs) => {
    const project = ('id' in args.project
            ? await projects.byId(args.project)
            : await projects.byName({
                name: args.project.name ?? args.project.nameContains,
                exact: 'name' in args.project
            })
    ) ?? exit('unknown project {0}', args.project)

    const task = ('id' in args.task
            ? projects.tasksOf(project).byId(args.task)
            : projects.tasksOf(project).byName({
                name: args.task.name ?? args.task.nameContains,
                exact: 'name' in args.task
            })
    ) ?? exit('unknown task {1} of project {0}', args.project, args.task)

    const notes = inputs.reduce((n, v, i) => n.replace(`{${i}}`, v), args.notes)

    return { project, task, notes }
}

const startedTimer = async ({ project: { id: project_id }, task: { id: task_id }, notes, started_time }) => {
    const started = await api.time.startToday({ project_id, task_id, notes, started_time })
    return formatting.timeEntry.started(started)
}

const exit = (message, ...args) => {
    throw Error(args.reduce((m, arg, i) => m.replace(`{${i}}`, JSON.stringify(arg)), message))
}

export default {
    run: startTimer
}