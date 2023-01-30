#! /usr/bin/env node

import dayjs from 'dayjs'
import { chalk } from 'zx'

import actionRestartTimer from './harvest/action-restart-timer.js'
import actionShowDay from './harvest/action-show-day.js'
import actionStopTimer from './harvest/action-stop-timer.js'
import api from './harvest/api.js'
import timeEntries from './harvest/time-entries.js'

import dotenv from './utils/dotenv.js'
import bash from './utils/git-bash.js'
import prompt from './utils/prompt.js'

await bash.init()
await dotenv.read()

/** Welcome */
const { id: user_id, first_name } = await api.users.me()
console.log(
    `👋 Hello, ${first_name} (${user_id})\n`
)

const today = dayjs().startOf('day')
const latestEntry = await timeEntries.latest({ user_id, day: today })
console.log(
    !!latestEntry ? timeEntries.format.summary(latestEntry) : chalk.green('🌄 A fresh day ...')
)

/** Action? */
const chooseAction = ({ latestEntry }) => {
    const isRunning = latestEntry?.['is_running'] === true

    const actions = ['🌟 start new', '🔁 continue with ...', '📅 show today']
    if (isRunning) actions.push('🤚 stop running')

    return prompt.ask(
        prompt.question.select({
            name: 'action',
            message: '⌚ Harvest time tracking',
            choices: actions
        })
    ).then(({ action }) => action.split(' ')[1])
}

const runAction = async (action, { user_id, latestEntry, today }) => {
    const script = {
        'start': { $: () => console.error(chalk.red('TODO')) },
        'stop': { $: () => actionStopTimer.run({ entry: latestEntry }) },
        'continue': { $: () => actionRestartTimer.run({ user_id }) },
        'show': { $: () => actionShowDay.run({ user_id, day: today }) }
    }[action] ?? {
        $: () => console.error(chalk.red('🤷‍♀️️ unknown action'))
    }

    await script.$()

    return { done: action !== 'show' }
}

let exit = false
while (!exit) {
    console.log()
    await runAction(
        await chooseAction({ latestEntry }),
        { user_id, latestEntry, today }
    ).then(({ done }) => done)
}

// // TODO EXPERIMENTING HERE
// const projects = await harvestProjects.current()
// const { project } = await prompt.ask(
//     prompt.question.select({
//         name: 'project',
//         message: 'project',
//         choices: namedChoices(projects, ({ project }) => project.name)
//     })
// )
//
// console.log(project)